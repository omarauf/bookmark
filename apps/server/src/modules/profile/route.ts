import { ProfileSchemas } from "@workspace/contracts/views/profile";
import { and, asc, count, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { items } from "../item/schema";
import { relations } from "../relation/schema";
import { mapItemToProfile } from "./mapper";

export const profileRouter = {
  list: protectedProcedure
    .input(ProfileSchemas.list.request)
    .output(ProfileSchemas.list.response)
    .handler(async ({ input }) => {
      const offset = (input.page - 1) * input.perPage;

      const filterExpression = and(
        eq(items.kind, "profile"),
        input.platform ? eq(items.platform, input.platform) : undefined,
        input.username
          ? ilike(sql`(${items.metadata}->>'username')`, `%${input.username}%`)
          : undefined,
      );

      const orderBy = {
        createdAt: items.createdAt,
        username: sql`(${items.metadata}->>'username')`,
        postCount: sql`post_count`,
        tagCount: sql`tag_count`,
      }[input.sortBy || "createdAt"];

      const [data, [{ totalCount }]] = await Promise.all([
        db.query.items.findMany({
          where: filterExpression,
          limit: input.perPage,
          offset: offset,
          extras: {
            postCount:
              sql<number>`(select count(*) from ${relations} where ${relations.toItemId} = ${items.id} and ${relations.relationType} = 'created_by')`.as(
                "post_count",
              ),
            tagCount:
              sql<number>`(select count(*) from ${relations} where ${relations.toItemId} = ${items.id} and ${relations.relationType} = 'tagged')`.as(
                "tag_count",
              ),
          },
          orderBy: input.sortOrder === "asc" ? asc(orderBy) : desc(orderBy),
        }),

        db.select({ totalCount: count() }).from(items).where(filterExpression),
      ]);

      const mappedItems = data.map(mapItemToProfile);

      return {
        items: mappedItems,
        total: totalCount,
        page: input.page,
        perPage: input.perPage,
        totalPages: Math.ceil(totalCount / input.perPage),
        hasNextPage: input.page < Math.ceil(totalCount / input.perPage),
        hasPreviousPage: input.page > 1,
      };
    }),
};
