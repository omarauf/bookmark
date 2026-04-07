import { CollectionSchemas } from "@workspace/contracts/collection";
import { and, arrayContained, eq, getTableColumns, lte, ne, or, sql } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { collections } from "./schema";
import { isDescendantPath, normalizePathSafe } from "./service";
import { getSlugPath } from "./utils";

export const collectionRouter = {
  all: protectedProcedure.output(CollectionSchemas.all.response).handler(async () => {
    return await db
      .select({
        ...getTableColumns(collections),
        value: collections.path,
      })
      .from(collections)
      .orderBy(collections.path, collections.slug);
  }),

  list: protectedProcedure
    .input(CollectionSchemas.list.request)
    .output(CollectionSchemas.list.response)
    .handler(async ({ input }) => {
      const { depth } = input;
      const path = normalizePathSafe(input.path);
      const extraPath = normalizePathSafe(input.extraPath);

      const rows = await db
        .select({
          id: collections.id,
          parentId: collections.parentId,
          value: collections.path,
          path: collections.path,
          level: collections.level,
          slug: collections.slug,
          label: collections.label,
          color: collections.color,
          createdAt: collections.createdAt,
          updatedAt: collections.updatedAt,
          isLast: sql<boolean>`NOT EXISTS (SELECT 1 FROM collections ch WHERE ch.parent_id = collections.id)`,
        })
        .from(collections)
        .where(
          or(
            and(
              path ? arrayContained(collections.path, path) : undefined,
              depth && !path ? lte(collections.level, depth) : undefined,
              depth && path ? sql`${collections.level} <= (nlevel(${path}) + ${depth})` : undefined,
            ),
            extraPath ? arrayContained(collections.path, extraPath) : undefined,
          ),
        )
        .orderBy(collections.path, collections.slug);

      return rows;
    }),

  breadcrumb: protectedProcedure
    .input(CollectionSchemas.breadcrumb.request)
    .output(CollectionSchemas.breadcrumb.response)
    .handler(async ({ input }) => {
      if ("path" in input) {
        return await db
          .select({ path: collections.path, label: collections.label })
          .from(collections)
          .where(arrayContained(collections.path, input.path))
          .orderBy(collections.level);
      }

      const target = db
        .$with("target")
        .as(
          db
            .select({ path: collections.path })
            .from(collections)
            .where(eq(collections.id, input.id))
            .limit(1),
        );

      return await db
        .with(target)
        .select({ path: collections.path, label: collections.label })
        .from(collections)
        .innerJoin(target, arrayContained(collections.path, target.path))
        .orderBy(collections.level);
    }),

  get: protectedProcedure
    .input(CollectionSchemas.get.request)
    .output(CollectionSchemas.get.response)
    .errors({ NOT_FOUND: { message: "Collection not found" } })
    .handler(async ({ input, errors }) => {
      const [collection] = await db.select().from(collections).where(eq(collections.id, input.id));
      if (!collection) throw errors.NOT_FOUND();
      return collection;
    }),

  create: protectedProcedure
    .input(CollectionSchemas.create.request)
    .output(CollectionSchemas.create.response)
    .errors({
      BAD_REQUEST: { message: "Parent collection not found" },
      CONFLICT: { message: "Collection already exists" },
    })
    .handler(async ({ input, errors }) => {
      const parentId = input.parentId;
      const { slug, path } = getSlugPath(input.label, input.slug);

      let parentPath: string | null = null;
      let parentLevel = 0;

      if (parentId) {
        const parent = await db.query.collections.findFirst({
          where: (t, { eq }) => eq(t.id, parentId),
          columns: { path: true, level: true },
        });

        if (!parent) throw errors.BAD_REQUEST();

        parentPath = parent.path;
        parentLevel = parent.level;
      }

      const finalPath = parentId ? `${parentPath}.${path}` : path;
      const level = parentLevel + 1;

      const [exists] = await db
        .select({ id: collections.id })
        .from(collections)
        .where(eq(collections.path, finalPath))
        .limit(1);

      if (exists) throw errors.CONFLICT();

      await db.insert(collections).values({ ...input, slug, path: finalPath, level });
    }),

  update: protectedProcedure
    .input(CollectionSchemas.update.request)
    .output(CollectionSchemas.update.response)
    .errors({
      NOT_FOUND: { message: "Collection not found" },
      BAD_REQUEST: { message: "Invalid collection update" },
      BAD_REQUEST_CHILD: {
        message: "You cannot move a node under its own descendants.",
        status: 400,
      },
      BAD_REQUEST_SELF: { message: "A collection cannot be its own parent", status: 400 },
      CONFLICT: { message: "Collection already exists" },
    })
    .handler(async ({ input, errors }) => {
      const { id, parentId, ...data } = input;
      const [existing] = await db.select().from(collections).where(eq(collections.id, id));

      if (!existing) throw errors.NOT_FOUND();

      let newParentPath: string | null = null;
      let newParentLevel = 0;

      if (parentId) {
        // Prevent self-parenting
        if (parentId === existing.id) throw errors.BAD_REQUEST_SELF();

        const parent = await db.query.collections.findFirst({
          where: (t, { eq }) => eq(t.id, parentId),
          columns: { path: true, level: true },
        });

        if (!parent) throw errors.BAD_REQUEST();

        const isDescendant = await isDescendantPath(parent.path, existing.path);
        if (isDescendant) throw errors.BAD_REQUEST_CHILD();

        newParentPath = parent.path;
        newParentLevel = parent.level;
      }

      const { slug, path } = getSlugPath(input.label, input.slug);

      const oldPath = existing.path;
      const oldLevel = existing.level;
      const newPath = newParentPath ? `${newParentPath}.${path}` : path;
      const newLevel = newParentLevel + 1;

      const pathChanged = newPath !== oldPath || newLevel !== oldLevel;

      await db.transaction(async (tx) => {
        // 1) Check for path conflict if path is changing
        if (pathChanged) {
          const [conflict] = await tx
            .select({ id: collections.id })
            .from(collections)
            .where(and(eq(collections.path, newPath), ne(collections.id, id)))
            .limit(1);

          if (conflict) throw errors.CONFLICT();
        }

        // 2) Update the node itself
        await tx
          .update(collections)
          .set({ ...data, parentId, slug, path: newPath, level: newLevel })
          .where(eq(collections.id, id));

        if (!pathChanged) return;

        const descendants = await tx
          .select({ id: collections.id, path: collections.path, level: collections.level })
          .from(collections)
          .where(
            and(
              // sql`${collections.path} <@ ${oldPath} AND ${collections.id} <> ${id}`,
              ne(collections.id, id),
              arrayContained(collections.path, oldPath),
            ),
          );

        const levelDelta = newLevel - oldLevel;

        for (const descendant of descendants) {
          const suffix = descendant.path.slice(oldPath.length + 1);
          const updatedPath = pathChanged ? `${newPath}.${suffix}` : descendant.path;
          const updatedLevel = pathChanged ? descendant.level + levelDelta : descendant.level;

          await tx
            .update(collections)
            .set({ path: updatedPath, level: updatedLevel })
            .where(eq(collections.id, descendant.id));
        }
      });
    }),

  delete: protectedProcedure
    .input(CollectionSchemas.delete.request)
    .output(CollectionSchemas.delete.response)
    .errors({
      NOT_FOUND: { message: "Collection not found" },
      BAD_REQUEST: { message: "Collection has children" },
    })
    .handler(async ({ input, errors }) => {
      const [existing] = await db.select().from(collections).where(eq(collections.id, input.id));

      if (!existing) throw errors.NOT_FOUND();

      const [child] = await db
        .select({ id: collections.id })
        .from(collections)
        .where(eq(collections.parentId, input.id))
        .limit(1);

      if (child) throw errors.BAD_REQUEST();

      await db.delete(collections).where(eq(collections.id, input.id));
    }),
};
