import type { LinkSchemas } from "@workspace/contracts/link";
import { and, eq, isNull, sql } from "drizzle-orm";
import type z from "zod";
import { db } from "@/core/db";
import { randomDelay } from "@/utils/delay";
import { items } from "../item/schema";
import { mapItemToLink } from "./mapper";
import { fetchPreviewForUrl } from "./service";
import { mergeMetadata } from "./utils";

type FetchRequest = z.infer<typeof LinkSchemas.fetchPreviews.request>;

export async function fetchLinkPreviews({ batchSize, headers, domain, overwrite }: FetchRequest) {
  console.log(
    `[LinkPreview] Starting batch, batchSize=${batchSize}`,
    domain ? `, domain=${domain}` : "All domains",
    `, overwrite=${overwrite ? "true" : "false"}`,
  );

  const result = {
    processed: 0,
    succeeded: 0,
    failed: 0,
  };

  const linksWithoutPreview = await db
    .select({ id: items.id, url: items.url, metadata: items.metadata })
    .from(items)
    .where(
      and(
        eq(items.platform, "chrome"),
        isNull(items.deletedAt),
        overwrite ? undefined : sql`${items.metadata} ->> 'preview' IS NULL`,
        domain ? sql`${items.url} LIKE ${`%${domain}%`}` : undefined,
      ),
    )
    .limit(batchSize);

  if (linksWithoutPreview.length === 0) {
    console.log("[LinkPreview] No links without previews found. Done.");
    return result;
  }

  console.log(`[LinkPreview] Found ${linksWithoutPreview.length} links to process`);

  for (const link of linksWithoutPreview) {
    try {
      if (link.metadata.platform !== "chrome") continue;

      await randomDelay(500, 1500);

      if (!link.url.startsWith("http")) {
        console.log(`[LinkPreview] Skipping non-http URL ${link.url}`);
        result.failed++;
        result.processed++;
        continue;
      }

      const preview = await fetchPreviewForUrl(link.url, headers);

      if (preview) {
        const newMetadata = mergeMetadata(link.metadata?.preview, preview);

        await db
          .update(items)
          .set({
            metadata: sql`jsonb_set(${items.metadata}, '{preview}', ${JSON.stringify(newMetadata)}::jsonb)`,
          })
          .where(eq(items.id, link.id));

        console.log(`[LinkPreview] ✓ Saved preview for ${link.url}`);
        result.succeeded++;
      } else {
        console.log(`[LinkPreview] ✗ No preview extracted for ${link.url}`);
        result.failed++;
      }

      result.processed++;
    } catch (err) {
      console.error(`[LinkPreview] ✗ Error processing link ${link.id} (${link.url}):`, err);
      result.failed++;
      result.processed++;
    }
  }

  console.log(
    `[LinkPreview] Batch complete: ${result.succeeded} succeeded, ${result.failed} failed out of ${result.processed} processed`,
  );

  return result;
}

export async function fetchLinkPreviewById(id: string) {
  const [item] = await db
    .select()
    .from(items)
    .where(and(eq(items.id, id), isNull(items.deletedAt)))
    .limit(1);

  if (!item) throw new Error(`Link with id ${id} not found`);
  if (!item.url?.startsWith("http")) throw new Error(`Invalid URL: ${item.url}`);

  const preview = await fetchPreviewForUrl(item.url);
  if (!preview) throw new Error(`Failed to fetch preview for ${item.url}`);
  if (item.metadata.platform !== "chrome") throw new Error(`Item with id ${id} is not a link`);

  const newMetadata = mergeMetadata(item.metadata?.preview, preview);

  await db
    .update(items)
    .set({
      metadata: sql`jsonb_set(${items.metadata}, '{preview}', ${JSON.stringify(newMetadata)}::jsonb)`,
    })
    .where(eq(items.id, id));

  const [updated] = await db.select().from(items).where(eq(items.id, id)).limit(1);
  return mapItemToLink(updated);
}
