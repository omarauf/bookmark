import type { ListPost, PostFilter } from "@workspace/contracts/post";
import {
  and,
  arrayContained,
  count,
  eq,
  exists,
  gte,
  ilike,
  inArray,
  lte,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { parseDateWithFlexibleTZ } from "@/core/date";
import { db } from "@/core/db";
import { collectionItems, collections } from "@/modules/collection/schema";
import { items } from "@/modules/item/schema";
import { relations } from "@/modules/relation/schema";
import { mapItemToPost } from "./mapper";

export async function listPosts(input: ListPost) {
  // Calculate offset based on current page
  const offset = (input.page - 1) * input.perPage;
  console.log("Calculated offset:", offset);

  // 1. Extract the complex EXISTS condition to reuse it in both queries
  const filterExpression = buildItemFilter(input);

  // 2. Execute Data Fetch and Count concurrently
  const [data, [{ totalCount }]] = await Promise.all([
    // Data query (with Limit and Offset)
    db.query.items.findMany({
      where: filterExpression,
      with: {
        outgoing: { with: { toItem: { with: { media: true } } } },
        collections: { with: { collection: true } },
        media: true,
      },
      // extras: {
      //   // Add the window function as an extra column
      //   totalCount: sql<number>`count(*) over()`.as("total_count"),
      // },
      limit: input.perPage,
      offset: offset,
      orderBy: (post, { asc, desc }) =>
        input.sortOrder === "asc" ? asc(post.createdAt) : desc(post.createdAt),
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
  const { platform, username, type, from, to, collectionIds, collectionPath, collectionPaths } =
    filter;
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

  if (collectionPaths && collectionPaths.length > 0) {
    whereClauses.push(
      exists(
        db
          .select()
          .from(collections)
          .leftJoin(collectionItems, eq(collectionItems.collectionId, collections.id))
          .where(
            and(
              eq(collectionItems.itemId, items.id),
              or(...collectionPaths.map((path) => arrayContained(collections.path, path))),
            ),
          ),
      ),
    );
  }

  if (collectionPath) {
    whereClauses.push(
      exists(
        db
          .select()
          .from(collections)
          .leftJoin(collectionItems, eq(collectionItems.collectionId, collections.id))
          .where(
            and(
              eq(collectionItems.itemId, items.id),
              or(arrayContained(collections.path, collectionPath)),
            ),
          ),
      ),
    );
  }

  if (collectionIds && collectionIds.length > 0) {
    // TODO: compare performance of the below two approaches and decide which one to use
    // whereClauses.push(
    //   inArray(
    //     items.id,
    //     db
    //       .select({ itemId: collectionItems.itemId })
    //       .from(items)
    //       .leftJoin(collectionItems, eq(items.id, collectionItems.itemId))
    //       .where(and(inArray(collectionItems.collectionId, collectionIds))),
    //   ),
    // );
    whereClauses.push(
      exists(
        db
          .select()
          .from(collectionItems)
          .where(
            and(
              eq(collectionItems.itemId, items.id),
              inArray(collectionItems.collectionId, collectionIds),
            ),
          ),
      ),
    );
  }

  if (type) {
    whereClauses.push(sql`${items.metadata}->>'type' = ${type}`);
  }

  if (from) {
    whereClauses.push(gte(items.createdAt, parseDateWithFlexibleTZ(from)));
  }

  if (to) {
    const toDate = parseDateWithFlexibleTZ(to);
    // Add 1 day to include the entire 'to' date
    toDate.setUTCDate(toDate.getUTCDate() + 1);
    whereClauses.push(lte(items.createdAt, toDate));
  }

  return and(...whereClauses);
}

export async function getPost(id: string) {
  const post = await db.query.items.findFirst({
    where: (items, { eq }) => eq(items.id, id),
    with: {
      outgoing: { with: { toItem: { with: { media: true } } } },
      media: true,
      collections: { with: { collection: true } },
    },
    // extras: {
    //   // Add the window function as an extra column
    //   totalCount: sql<number>`count(*) over()`.as("total_count"),
    // },
  });

  if (!post) return null;

  return mapItemToPost(post);
}
