import { ItemSchemas } from "@workspace/contracts/item";
import type { Job } from "@workspace/contracts/job";
import { YoutubeDiscoverPayloadSchema, YoutubeFetchPayloadSchema } from "@workspace/contracts/job";
import z from "zod";
import { db } from "@/core/db";
import { items } from "@/modules/item/schema";
import { relations } from "@/modules/relation/schema";
import { youtubeClient } from "@/modules/youtube/integrations";
import { getYoutubeMetadata } from "@/modules/youtube/mapper";
import { delay } from "@/utils/delay";
import { jobGroups, jobs } from "../schema";
import { log, updateJobProgress } from "../service";

export async function processYoutubeDiscover(job: Job) {
  const parseResult = YoutubeDiscoverPayloadSchema.safeParse(job.payload);
  if (!parseResult.success) {
    const error = z.prettifyError(parseResult.error);
    throw new Error(`Invalid job payload: ${error}`);
  }

  await log(job.id, "info", "Scanning chrome links for YouTube IDs");

  // 1. Find all chrome items with youtube.com links
  const linkItems = await db.query.items.findMany({
    where: (item, { eq }) => eq(item.platform, "chrome"),
  });

  // Build map of videoId -> source link item id
  const videoIdToLinkId = new Map<string, string>();
  for (const item of linkItems) {
    const match = item.url?.match(/youtube\.com\/watch\?v=(.*)/);
    if (match) videoIdToLinkId.set(match[1], item.id);
  }

  const uniqueIds = Array.from(videoIdToLinkId.keys());

  if (uniqueIds.length === 0) {
    await log(job.id, "info", "No YouTube links found");
    await updateJobProgress(job.id, 100);
    return;
  }

  await log(job.id, "info", `Found ${uniqueIds.length} unique YouTube IDs`, {
    count: uniqueIds.length,
  });

  // 2. Filter out already existing YouTube items
  const existingItems = await db.query.items.findMany({
    where: (item, { and, inArray: inArr, eq }) =>
      and(eq(item.platform, "youtube"), inArr(item.externalId, uniqueIds)),
    columns: { externalId: true },
  });

  const existingIds = new Set(existingItems.map((i) => i.externalId));
  const newIds = uniqueIds.filter((id) => !existingIds.has(id));

  await log(job.id, "info", `${newIds.length} new IDs to process`, {
    new: newIds.length,
    existing: existingIds.size,
  });

  if (newIds.length === 0) {
    await log(job.id, "info", "All YouTube items already imported");
    await updateJobProgress(job.id, 100);
    return;
  }

  if (newIds.length > 0) {
    // 3. Create a job group for the fetch jobs
    const [group] = await db
      .insert(jobGroups)
      .values({ name: `youtube-sync-${Date.now()}`, createdAt: new Date() })
      .returning();

    await log(job.id, "info", "Created job group", { groupId: group.id, name: group.name });

    // 4. Spawn one youtube_fetch job per new ID
    let created = 0;
    let skipped = 0;

    for (const videoId of newIds) {
      const linkId = videoIdToLinkId.get(videoId);

      if (!linkId) {
        await log(job.id, "warn", "No source link found for YouTube ID, skipping", { videoId });
        skipped++;
        continue;
      }

      try {
        await db
          .insert(jobs)
          .values({
            type: "youtube_fetch",
            status: "pending",
            resourceType: "youtube",
            resourceId: videoId,
            payload: { videoId, linkId },
            groupId: group.id,
            createdAt: new Date(),
          })
          .onConflictDoNothing();

        created++;
      } catch {
        skipped++;
      }
    }

    await log(job.id, "info", "Spawned fetch jobs", { created, skipped, groupId: group.id });
  }

  await updateJobProgress(job.id, 100);
}

export async function processYoutubeFetch(job: Job) {
  const parseResult = YoutubeFetchPayloadSchema.safeParse(job.payload);
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

  const [{ id: newItemId }] = await db
    .insert(items)
    .values(result.data)
    .returning({ id: items.id });

  // Create relation: youtube item was created_by source link
  if (linkId) {
    await db
      .insert(relations)
      .values({
        fromItemId: newItemId,
        toItemId: linkId,
        relationType: "created_by",
        x: 0,
        y: 0,
      })
      .onConflictDoNothing();
  }

  await log(job.id, "info", "Item imported", {
    videoId,
    title: data.items[0].snippet.title,
    type: data.items[0].kind,
  });
  await updateJobProgress(job.id, 100);

  // Small delay to avoid YouTube rate limits when multiple workers run concurrently
  await delay(500);
}
