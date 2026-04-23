import type { LinkPreview } from "@workspace/contracts/link";
import axios from "axios";
import { and, eq, isNull, sql } from "drizzle-orm";
import { getPreviewFromContent } from "link-preview-js";
import { db } from "@/core/db";
import { randomDelay } from "@/utils/delay";
import { items } from "../item/schema";

export async function fetchLinkPreviews(batchSize = 50) {
  console.log(`[LinkPreview] Starting batch, batchSize=${batchSize}`);

  const result = {
    processed: 0,
    succeeded: 0,
    failed: 0,
  };

  const linksWithoutPreview = await db
    .select({ id: items.id, url: items.url })
    .from(items)
    .where(
      and(
        eq(items.platform, "chrome"),
        isNull(items.deletedAt),
        sql`${items.metadata} ->> 'preview' IS NULL`,
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
      await randomDelay(500, 1500);

      if (!link.url.startsWith("http")) {
        console.log(`[LinkPreview] Skipping non-http URL ${link.url}`);
        result.failed++;
        result.processed++;
        continue;
      }

      const preview = await fetchPreviewForUrl(link.url);

      if (preview) {
        await db
          .update(items)
          .set({
            metadata: sql`jsonb_set(${items.metadata}, '{preview}', ${JSON.stringify(preview)}::jsonb)`,
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

async function fetchPreviewForUrl(url: string): Promise<LinkPreview | null> {
  try {
    // console.log(`[LinkPreview] Fetching ${url}`);
    const response = await axios.get<string>(url, {
      responseType: "text",
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true,
    });

    if (response.status >= 400) {
      // console.log(`[LinkPreview] HTTP ${response.status} for ${url}, skipping`);
      return null;
    }

    const preFetched = {
      headers: { "content-type": String(response.headers["content-type"]) },
      status: response.status,
      url,
      data: response.data,
    };

    const data = await getPreviewFromContent(preFetched);

    return {
      url: data.url,
      mediaType: data.mediaType,
      favicons: data.favicons,
      title: "title" in data ? data.title || undefined : undefined,
      siteName: "siteName" in data ? data.siteName || undefined : undefined,
      description: "description" in data ? data.description || undefined : undefined,
      images: "images" in data ? data.images || undefined : undefined,

      charset: "charset" in data ? data.charset || undefined : undefined,
      contentType: "contentType" in data ? data.contentType || undefined : undefined,
      videos: "videos" in data ? data.videos || undefined : undefined,
    };
  } catch {
    // console.error(
    //   `[LinkPreview] Failed to fetch ${url}:`,
    //   err instanceof Error ? err.message : err,
    // );
    return null;
  }
}
