import { TagSchemas } from "@workspace/contracts/tag";
import { eq, ilike } from "drizzle-orm";
import { db } from "@/core/db";
import { publicProcedure } from "@/lib/orpc";
import { tags } from "./schema";

export const tagRouter = {
  list: publicProcedure
    .input(TagSchemas.list.request)
    .output(TagSchemas.list.response)
    .handler(async ({ input }) => {
      const filters = input.name ? ilike(tags.name, `%${input.name}%`) : undefined;

      const dataQuery = await db.select().from(tags).where(filters).orderBy(tags.name);

      return dataQuery.map((d) => ({ ...d, count: 0 }));
    }),

  options: publicProcedure
    .input(TagSchemas.options.request)
    .output(TagSchemas.options.response)
    .handler(async () => {
      return await db.select({ id: tags.id, name: tags.name, color: tags.color }).from(tags);
    }),

  create: publicProcedure
    .input(TagSchemas.create.request)
    .output(TagSchemas.create.response)
    .errors({ CONFLICT: { message: "A tag with the same name already exists" } })
    .handler(async ({ input, errors }) => {
      const existing = await db.select().from(tags).where(eq(tags.name, input.name)).limit(1);

      if (existing.length > 0) throw errors.CONFLICT();

      await db.insert(tags).values(input);
    }),

  update: publicProcedure
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

  delete: publicProcedure
    .input(TagSchemas.delete.request)
    .output(TagSchemas.delete.response)
    .errors({ NOT_FOUND: { message: "Tag not found" } })
    .handler(async ({ input: { id }, errors }) => {
      const [existing] = await db.select().from(tags).where(eq(tags.id, id)).limit(1);

      if (existing === undefined) throw errors.NOT_FOUND();

      await db.delete(tags).where(eq(tags.id, id));
    }),
};
