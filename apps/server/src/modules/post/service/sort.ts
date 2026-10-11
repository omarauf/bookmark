import type { ListPost } from "@workspace/contracts/views/post";
import { asc, desc, sql } from "drizzle-orm";
import { items } from "@/modules/item/schema";

/** Use platform counters for views and keep missing values last in either direction. */
export function getPostOrderBy(input: Pick<ListPost, "sortBy" | "sortOrder">) {
  const columns = {
    addedAt: items.addedAt,
    publishedAt: items.publishedAt,
    rate: items.rate,
    likes: sql`(${items.metadata}->>'likes')::numeric`,
    views: sql`(CASE ${items.platform}
      WHEN 'instagram' THEN COALESCE(${items.metadata}->>'view', ${items.metadata}->>'play')
      WHEN 'tiktok' THEN ${items.metadata}->>'plays'
      WHEN 'twitter' THEN ${items.metadata}->>'views'
    END)::numeric`,
  };
  const order = input.sortOrder === "asc" ? asc : desc;
  return [sql`${order(columns[input.sortBy ?? "addedAt"])} NULLS LAST`, order(items.id)];
}
