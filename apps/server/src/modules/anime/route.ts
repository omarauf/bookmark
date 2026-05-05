import { AnimeSchemas } from "@workspace/contracts/anime-view";
import { and, count, desc, eq, ilike, isNull, sql } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { items } from "@/modules/item/schema";
import { createSingleJob } from "@/modules/job/service";
import { mapItemToAnime } from "./mapper";

export const animeRouter = {
  list: protectedProcedure
    .input(AnimeSchemas.list.request)
    .output(AnimeSchemas.list.response)
    .handler(async ({ input }) => {
      const offset = (input.page - 1) * input.perPage;

      const { q, genre, year, minRating } = input;

      const conditions = and(
        eq(items.platform, "mal"),
        isNull(items.deletedAt),
        q ? ilike(items.caption, `%${q}%`) : undefined,
        genre ? sql`${items.metadata}->'genres' ? ${genre}` : undefined,
        year ? sql`${items.metadata}->>'startSeasonYear' = ${String(year)}` : undefined,
        minRating ? sql`(${items.metadata}->>'rating')::float >= ${minRating}` : undefined,
      );

      const orderBy = {
        rating: desc(sql`(${items.metadata}->>'rating')::float`),
        year: desc(sql`(${items.metadata}->>'startSeasonYear')::int`),
        createdAt: desc(items.createdAt),
      }[input.sortBy || "createdAt"];

      const [data, [{ totalCount }]] = await Promise.all([
        db.query.items.findMany({
          where: conditions,
          with: {
            collections: {
              with: {
                collection: { columns: { id: true, label: true, color: true } },
              },
            },
            tags: {
              with: { tag: { columns: { id: true, name: true, color: true } } },
            },
          },
          limit: input.perPage,
          offset,
          orderBy,
        }),
        db.select({ totalCount: count() }).from(items).where(conditions),
      ]);

      return {
        items: mapItemToAnime(data),
        total: totalCount,
        page: input.page,
        perPage: input.perPage,
        totalPages: Math.ceil(totalCount / input.perPage),
        hasNextPage: input.page < Math.ceil(totalCount / input.perPage),
        hasPreviousPage: input.page > 1,
      };
    }),

  genres: protectedProcedure.output(AnimeSchemas.genres.response).handler(async () => {
    const result = await db
      .select({
        genre: sql<string>`jsonb_array_elements_text(metadata->'genres')`,
      })
      .from(items)
      .where(and(eq(items.platform, "mal"), isNull(items.deletedAt)))
      .groupBy(sql`jsonb_array_elements_text(metadata->'genres')`);

    return result.map((row) => row.genre);
  }),

  sync: protectedProcedure.handler(async () => {
    const job = await createSingleJob({
      type: "anime_discover",
      status: "pending",
      payload: {},
    });

    return job;
  }),
};
