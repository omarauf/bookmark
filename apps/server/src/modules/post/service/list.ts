import type { ListPost, PostFilter } from "@workspace/contracts/post";
import { and, count, eq, exists, gte, ilike, lte, type SQL, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { parseDateWithFlexibleTZ } from "@/core/date";
import { db } from "@/core/db";
import { items } from "@/modules/item/schema";
import { relations } from "@/modules/relation/schema";
import { mapItemToPost } from "./mapper";

export async function listItem(input: ListPost) {
  // Calculate offset based on current page
  const offset = (input.page - 1) * input.perPage;

  // 1. Extract the complex EXISTS condition to reuse it in both queries
  const filterExpression = buildItemFilter(input);

  // 2. Execute Data Fetch and Count concurrently
  const [data, [{ totalCount }]] = await Promise.all([
    // Data query (with Limit and Offset)
    db.query.items.findMany({
      where: filterExpression,
      with: {
        outgoing: { with: { toItem: { with: { media: true } } } },
        media: true,
      },
      // extras: {
      //   // Add the window function as an extra column
      //   totalCount: sql<number>`count(*) over()`.as("total_count"),
      // },
      limit: input.perPage,
      offset: offset,
    }),

    // Count query
    db.select({ totalCount: count() }).from(items).where(filterExpression),
  ]);

  const mappedItems = data.map((raw) => {
    return mapItemToPost(raw);
  });

  // 3. Return the payload with helpful pagination metadata
  return {
    items: mappedItems,
    total: totalCount,
    page: input.page,
    perPage: input.perPage,
    totalPages: Math.ceil(totalCount / input.perPage),
    hasNextPage: input.page < Math.ceil(totalCount / input.perPage),
    hasPreviousPage: input.page > 1,
  };
}

function buildItemFilter(filter: PostFilter) {
  const { platform, username, type, from, to } = filter;
  const whereClauses: SQL[] = [eq(items.kind, "post")];

  if (platform) {
    whereClauses.push(eq(items.platform, platform));
  }

  if (username) {
    // whereClauses.push(ilike(`${items.metadata}->>'username'`, `%${username}%`));
    const related_item = alias(items, "related_item");
    whereClauses.push(
      exists(
        db
          .select()
          .from(relations)
          .leftJoin(related_item, eq(related_item.id, relations.toItemId))
          .where(
            and(
              eq(relations.relationType, "created_by"),
              eq(relations.fromItemId, items.id),
              ilike(sql`(${related_item.metadata}->>'name')`, `%${username}%`),
            ),
          ),
      ),
    );
  }

  //   if (collectionIds && collectionIds.length > 0) {
  //     whereClauses.push(inArray(items.collectionId, collectionIds));
  //   }

  if (type) {
    whereClauses.push(sql`${items.metadata}->>'type' = ${type}`);
  }

  if (from) {
    whereClauses.push(gte(items.createdAt, parseDateWithFlexibleTZ(from)));
  }

  if (to) {
    whereClauses.push(lte(items.createdAt, parseDateWithFlexibleTZ(to)));
  }

  return and(...whereClauses);
}
