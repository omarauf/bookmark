import { ItemSchemas } from "@workspace/contracts/item";
import type { Job } from "@workspace/contracts/job";
import { JobPayloadSchemas } from "@workspace/contracts/job";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/core/db";
import { items } from "@/modules/item/schema";
import { youtubeClient } from "@/modules/youtube/integrations";
import { getYoutubeMetadata } from "@/modules/youtube/mapper";
import { delay } from "@/utils/delay";
import { log, updateJobProgress } from "../../service";

export async function processYoutubeFetch(job: Job) {
  const parseResult = JobPayloadSchemas.youtubeFetch.safeParse(job.payload);
  if (!parseResult.success) {
    const error = z.prettifyError(parseResult.error);
    throw new Error(`Invalid job payload: ${error}`);
  }

  const { videoId, linkId } = parseResult.data;

  await log(job.id, "info", "Fetching YouTube details", { videoId, linkId });
  await updateJobProgress(job.id, 10);

  const [data, error] = await youtubeClient.getByVideoId(videoId);

  if (error || !data) {
    throw new Error(`YouTube fetch failed for ${videoId}: ${error ?? "No data"}`);
  }

  await updateJobProgress(job.id, 50);

  const metadata = getYoutubeMetadata(data);

  const newItem = {
    platform: "youtube",
    externalId: videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    caption: data.items[0].snippet.title,
    kind: metadata.kind,
    metadata,
  };

  const result = ItemSchemas.create.safeParse(newItem);

  if (!result.success) {
    await log(job.id, "error", `Failed to parse YouTube item for ${videoId}`, { data });
    throw new Error(`Schema validation failed for ${videoId}: ${z.prettifyError(result.error)}`);
  }

  await db.transaction(async (tx) => {
    await tx.insert(items).values(result.data).returning({ id: items.id });
    await tx.delete(items).where(eq(items.id, linkId));
  });

  await log(job.id, "info", "Item imported", {
    videoId,
    title: data.items[0].snippet.title,
    type: data.items[0].kind,
  });
  await updateJobProgress(job.id, 100);

  // Small delay to avoid YouTube rate limits when multiple workers run concurrently
  await delay(500);
}
