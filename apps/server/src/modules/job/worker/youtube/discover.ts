import type { Job } from "@workspace/contracts/job";
import { JobPayloadSchemas } from "@workspace/contracts/job";
import z from "zod";
import { db } from "@/core/db";
import { getQueryParam } from "@/utils/url";
import { jobGroups, jobs } from "../../schema";
import { log, updateJobProgress } from "../../service";

export async function processYoutubeDiscover(job: Job) {
  const parseResult = JobPayloadSchemas.youtubeDiscover.safeParse(job.payload);
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
    const id = getQueryParam(item.url, "v");
    if (id) videoIdToLinkId.set(id, item.id);
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
