import { ImdbSchemas } from "@workspace/contracts/imdb-view";
import { and, count, desc, eq, ilike, isNull, sql } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { items } from "@/modules/item/schema";
import { createSingleJob } from "@/modules/job/service";
import { mapItemToImdb } from "./mapper";

export const imdbRouter = {
  list: protectedProcedure
    .input(ImdbSchemas.list.request)
    .output(ImdbSchemas.list.response)
    .handler(async ({ input }) => {
      const offset = (input.page - 1) * input.perPage;

      const { q, kind, genre, year, minRating } = input;

      const conditions = and(
        eq(items.platform, "imdb"),
        isNull(items.deletedAt),
        q ? ilike(items.caption, `%${q}%`) : undefined,
        kind ? sql`${items.metadata}->>'kind' = ${kind}` : undefined,
        genre ? sql`${items.metadata}->'genre' ? ${genre}` : undefined,
        year ? sql`${items.metadata}->>'year' = ${String(year)}` : undefined,
        minRating ? sql`(${items.metadata}->>'rating')::float >= ${minRating}` : undefined,
      );

      const orderBy = {
        rating: desc(sql`(${items.metadata}->>'rating')::float`),
        year: desc(sql`(${items.metadata}->>'year')::int`),
        createdAt: desc(items.createdAt),
      }[input.sortBy || "createdAt"];

      const [data, [{ totalCount }]] = await Promise.all([
        // Data query (with Limit and Offset)
        db.query.items.findMany({
          where: conditions,
          with: {
            collections: {
              with: { collection: { columns: { id: true, label: true, color: true } } },
            },
            tags: { with: { tag: { columns: { id: true, name: true, color: true } } } },
          },
          limit: input.perPage,
          offset: offset,
          orderBy: orderBy,
        }),

        // Count query
        db.select({ totalCount: count() }).from(items).where(conditions),
      ]);

      return {
        items: mapItemToImdb(data),
        total: totalCount,
        page: input.page,
        perPage: input.perPage,
        totalPages: Math.ceil(totalCount / input.perPage),
        hasNextPage: input.page < Math.ceil(totalCount / input.perPage),
        hasPreviousPage: input.page > 1,
      };
    }),

  genres: protectedProcedure.output(ImdbSchemas.genres.response).handler(async () => {
    const result = await db
      .select({ genre: sql<string>`jsonb_array_elements_text(metadata->'genre')` })
      .from(items)
      .where(and(eq(items.platform, "imdb"), isNull(items.deletedAt)))
      .groupBy(sql`jsonb_array_elements_text(metadata->'genre')`);

    return result.map((row) => row.genre);
  }),

  sync: protectedProcedure.handler(async () => {
    const job = await createSingleJob({ type: "imdb_discover", status: "pending", payload: {} });

    return job;
  }),
};
