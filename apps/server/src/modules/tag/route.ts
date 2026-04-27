import { TagSchemas } from "@workspace/contracts/tag";
import { count, eq } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { itemTags, tags } from "./schema";

export const tagRouter = {
  list: protectedProcedure.output(TagSchemas.list.response).handler(async () => {
    const dataQuery = await db.select().from(tags).orderBy(tags.name);

    const counts = await db
      .select({ tagId: itemTags.tagId, count: count() })
      .from(itemTags)
      .groupBy(itemTags.tagId);

    const countMap = new Map(counts.map((c) => [c.tagId, c.count]));

    return dataQuery.map((d) => ({ ...d, count: countMap.get(d.id) ?? 0 }));
  }),

  options: protectedProcedure
    .input(TagSchemas.options.request)
    .output(TagSchemas.options.response)
    .handler(async () => {
      return await db.select({ value: tags.id, label: tags.name, color: tags.color }).from(tags);
    }),

  create: protectedProcedure
    .input(TagSchemas.create.request)
    .output(TagSchemas.create.response)
    .errors({ CONFLICT: { message: "A tag with the same name already exists" } })
    .handler(async ({ input, errors }) => {
      const existing = await db.select().from(tags).where(eq(tags.name, input.name)).limit(1);

      if (existing.length > 0) throw errors.CONFLICT();

      await db.insert(tags).values(input);
    }),

  update: protectedProcedure
    .input(TagSchemas.update.request)
    .output(TagSchemas.update.response)
    .errors({
      CONFLICT: { message: "A tag with the same name already exists" },
      NOT_FOUND: { message: "Tag not found" },
    })
    .handler(async ({ input: { id, ...rest }, errors }) => {
      const [existing] = await db.select().from(tags).where(eq(tags.id, id)).limit(1);

      if (existing === undefined) throw errors.NOT_FOUND();

      if (existing.name !== rest.name) {
        const [other] = await db.select().from(tags).where(eq(tags.name, rest.name)).limit(1);

        if (other !== undefined) throw errors.CONFLICT();
      }

      await db.update(tags).set(rest).where(eq(tags.id, id));
    }),

  delete: protectedProcedure
    .input(TagSchemas.delete.request)
    .output(TagSchemas.delete.response)
    .errors({
      NOT_FOUND: { message: "Tag not found" },
      CONFLICT: { message: "Cannot delete tag with associated items" },
    })
    .handler(async ({ input: { id }, errors }) => {
      const [existing] = await db.select().from(tags).where(eq(tags.id, id)).limit(1);

      if (existing === undefined) throw errors.NOT_FOUND();

      const [linked] = await db
        .select({ count: count() })
        .from(itemTags)
        .where(eq(itemTags.tagId, id));

      if (linked.count > 0) throw errors.CONFLICT();

      await db.delete(tags).where(eq(tags.id, id));
    }),
};
