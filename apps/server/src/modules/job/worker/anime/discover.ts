import type { Job } from "@workspace/contracts/job";
import { JobPayloadSchemas } from "@workspace/contracts/job";
import z from "zod";
import { db } from "@/core/db";
import { jobGroups, jobs } from "../../schema";
import { log, updateJobProgress } from "../../service";

export async function processAnimeDiscover(job: Job) {
  const parseResult = JobPayloadSchemas.animeDiscover.safeParse(job.payload);
  if (!parseResult.success) {
    const error = z.prettifyError(parseResult.error);
    throw new Error(`Invalid job payload: ${error}`);
  }

  await log(job.id, "info", "Scanning chrome links for MyAnimeList IDs");

  const linkItems = await db.query.items.findMany({
    where: (item, { eq }) => eq(item.platform, "chrome"),
  });

  const animeIdToLinkId = new Map<string, string>();
  for (const item of linkItems) {
    const match = item.url?.match(/myanimelist\.net\/anime\/(\d+)/);
    if (match) animeIdToLinkId.set(match[1], item.id);
  }

  const uniqueIds = Array.from(animeIdToLinkId.keys());

  if (uniqueIds.length === 0) {
    await log(job.id, "info", "No MyAnimeList links found");
    await updateJobProgress(job.id, 100);
    return;
  }

  await log(job.id, "info", `Found ${uniqueIds.length} unique MyAnimeList IDs`, {
    count: uniqueIds.length,
  });

  const existingItems = await db.query.items.findMany({
    where: (item, { and, inArray: inArr, eq }) =>
      and(eq(item.platform, "mal"), inArr(item.externalId, uniqueIds)),
    columns: { externalId: true },
  });

  const existingIds = new Set(existingItems.map((i) => i.externalId));
  const newIds = uniqueIds.filter((id) => !existingIds.has(id));

  await log(job.id, "info", `${newIds.length} new IDs to process`, {
    new: newIds.length,
    existing: existingIds.size,
  });

  if (newIds.length === 0) {
    await log(job.id, "info", "All MyAnimeList items already imported");
    await updateJobProgress(job.id, 100);
    return;
  }

  if (newIds.length > 0) {
    const [group] = await db
      .insert(jobGroups)
      .values({ name: `anime-sync-${Date.now()}`, createdAt: new Date() })
      .returning();

    await log(job.id, "info", "Created job group", {
      groupId: group.id,
      name: group.name,
    });

    let created = 0;
    let skipped = 0;

    for (const animeId of newIds) {
      const linkId = animeIdToLinkId.get(animeId);

      if (!linkId) {
        await log(job.id, "warn", "No source link found for MyAnimeList ID, skipping", { animeId });
        skipped++;
        continue;
      }

      try {
        await db
          .insert(jobs)
          .values({
            type: "anime_fetch",
            status: "pending",
            resourceType: "anime",
            resourceId: animeId,
            payload: { animeId, linkId },
            groupId: group.id,
            createdAt: new Date(),
          })
          .onConflictDoNothing();

        created++;
      } catch {
        skipped++;
      }
    }

    await log(job.id, "info", "Spawned fetch jobs", {
      created,
      skipped,
      groupId: group.id,
    });
  }

  await updateJobProgress(job.id, 100);
}
