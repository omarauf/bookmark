import { CollectionSchemas } from "@workspace/contracts/collection";
import { eq, ilike } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { collections } from "./schema";

export const collectionRouter = {
  list: protectedProcedure
    .input(CollectionSchemas.list.request)
    .output(CollectionSchemas.list.response)
    .handler(async ({ input }) => {
      const filters = input.name ? ilike(collections.name, `%${input.name}%`) : undefined;

      const dataQuery = await db
        .select()
        .from(collections)
        .where(filters)
        .orderBy(collections.name);

      return dataQuery.map((d) => ({ ...d, count: 0 }));
    }),

  options: protectedProcedure
    .input(CollectionSchemas.options.request)
    .output(CollectionSchemas.options.response)
    .handler(async () => {
      return await db
        .select({ id: collections.id, name: collections.name, color: collections.color })
        .from(collections);
    }),

  create: protectedProcedure
    .input(CollectionSchemas.create.request)
    .output(CollectionSchemas.create.response)
    .errors({ CONFLICT: { message: "A collection with the same name already exists" } })
    .handler(async ({ input, errors }) => {
      const existing = await db
        .select()
        .from(collections)
        .where(eq(collections.name, input.name))
        .limit(1);

      if (existing.length > 0) throw errors.CONFLICT();

      await db.insert(collections).values(input);
    }),

  update: protectedProcedure
    .input(CollectionSchemas.update.request)
    .output(CollectionSchemas.update.response)
    .errors({
      CONFLICT: { message: "A collection with the same name already exists" },
      NOT_FOUND: { message: "Collection not found" },
    })
    .handler(async ({ input: { id, ...rest }, errors }) => {
      const [existing] = await db.select().from(collections).where(eq(collections.id, id)).limit(1);

      if (existing === undefined) throw errors.NOT_FOUND();

      if (existing.name !== rest.name) {
        const [other] = await db
          .select()
          .from(collections)
          .where(eq(collections.name, rest.name))
          .limit(1);

        if (other !== undefined) throw errors.CONFLICT();
      }

      await db.update(collections).set(rest).where(eq(collections.id, id));
    }),

  delete: protectedProcedure
    .input(CollectionSchemas.delete.request)
    .output(CollectionSchemas.delete.response)
    .errors({ NOT_FOUND: { message: "Collection not found" } })
    .handler(async ({ input: { id }, errors }) => {
      const [existing] = await db.select().from(collections).where(eq(collections.id, id)).limit(1);

      if (existing === undefined) throw errors.NOT_FOUND();

      await db.delete(collections).where(eq(collections.id, id));
    }),
};
