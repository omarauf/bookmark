import type { Job } from "@workspace/contracts/job";
import { JobPayloadSchemas } from "@workspace/contracts/job";
import z from "zod";
import { db } from "@/core/db";
import { jobGroups, jobs } from "../../schema";
import { log, updateJobProgress } from "../../service";

export async function processImdbDiscover(job: Job) {
  const parseResult = JobPayloadSchemas.imdbDiscover.safeParse(job.payload);
  if (!parseResult.success) {
    const error = z.prettifyError(parseResult.error);
    throw new Error(`Invalid job payload: ${error}`);
  }

  await log(job.id, "info", "Scanning chrome links for IMDb IDs");

  // 1. Find all chrome items with imdb.com links
  const linkItems = await db.query.items.findMany({
    where: (item, { eq }) => eq(item.platform, "chrome"),
  });

  // Build map of imdbId -> source link item id
  const imdbIdToLinkId = new Map<string, string>();
  for (const item of linkItems) {
    const match = item.url?.match(/imdb\.com\/title\/(tt\d+)/);
    if (match) imdbIdToLinkId.set(match[1], item.id);
  }

  const uniqueIds = Array.from(imdbIdToLinkId.keys());

  if (uniqueIds.length === 0) {
    await log(job.id, "info", "No IMDb links found");
    await updateJobProgress(job.id, 100);
    return;
  }

  await log(job.id, "info", `Found ${uniqueIds.length} unique IMDb IDs`, {
    count: uniqueIds.length,
  });

  // 2. Filter out already existing IMDb items
  const existingItems = await db.query.items.findMany({
    where: (item, { and, inArray: inArr, eq }) =>
      and(eq(item.platform, "imdb"), inArr(item.externalId, uniqueIds)),
    columns: { externalId: true },
  });

  const existingIds = new Set(existingItems.map((i) => i.externalId));
  const newIds = uniqueIds.filter((id) => !existingIds.has(id));

  await log(job.id, "info", `${newIds.length} new IDs to process`, {
    new: newIds.length,
    existing: existingIds.size,
  });

  if (newIds.length === 0) {
    await log(job.id, "info", "All IMDb items already imported");
    await updateJobProgress(job.id, 100);
    return;
  }

  if (newIds.length > 0) {
    // 3. Create a job group for the fetch jobs
    const [group] = await db
      .insert(jobGroups)
      .values({ name: `imdb-sync-${Date.now()}`, createdAt: new Date() })
      .returning();

    await log(job.id, "info", "Created job group", { groupId: group.id, name: group.name });

    // 4. Spawn one imdb_fetch job per new ID
    let created = 0;
    let skipped = 0;

    for (const imdbId of newIds) {
      const linkId = imdbIdToLinkId.get(imdbId);

      if (!linkId) {
        await log(job.id, "warn", "No source link found for IMDb ID, skipping", { imdbId });
        skipped++;
        continue;
      }

      try {
        await db
          .insert(jobs)
          .values({
            type: "imdb_fetch",
            status: "pending",
            resourceType: "imdb",
            resourceId: imdbId,
            payload: { imdbId, linkId },
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
