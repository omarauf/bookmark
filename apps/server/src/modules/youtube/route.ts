import { YoutubeSchemas } from "@workspace/contracts/views/youtube";
import { and, count, eq, ilike, isNull } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { items } from "@/modules/item/schema";
import { createSingleJob } from "@/modules/job/service";
import { mapItemToYoutube } from "./mapper-2";

export const youtubeRouter = {
  list: protectedProcedure
    .input(YoutubeSchemas.list.request)
    .output(YoutubeSchemas.list.response)
    .handler(async ({ input }) => {
      const offset = (input.page - 1) * input.perPage;

      const { q } = input;

      const conditions = and(
        eq(items.platform, "youtube"),
        isNull(items.deletedAt),
        q ? ilike(items.caption, `%${q}%`) : undefined,
      );

      // const orderBy = {
      //   rating: desc(sql`(${items.metadata}->>'rating')::float`),
      //   year: desc(sql`(${items.metadata}->>'startSeasonYear')::int`),
      //   createdAt: desc(items.createdAt),
      // }[input.sortBy || "createdAt"];

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
          // orderBy,
        }),
        db.select({ totalCount: count() }).from(items).where(conditions),
      ]);

      return {
        items: mapItemToYoutube(data),
        total: totalCount,
        page: input.page,
        perPage: input.perPage,
        totalPages: Math.ceil(totalCount / input.perPage),
        hasNextPage: input.page < Math.ceil(totalCount / input.perPage),
        hasPreviousPage: input.page > 1,
      };
    }),

  sync: protectedProcedure.handler(async () => {
    const job = await createSingleJob({
      type: "youtube_discover",
      status: "pending",
      payload: {},
    });

    return job;
  }),
};
