import { ItemSchemas } from "@workspace/contracts/item";
import type { Job } from "@workspace/contracts/job";
import { ImdbDiscoverPayloadSchema, ImdbFetchPayloadSchema } from "@workspace/contracts/job";
import z from "zod";
import { db } from "@/core/db";
import { omdbClient } from "@/modules/imdb/integrations/omdb";
import { imdbToItem } from "@/modules/imdb/service";
import { items } from "@/modules/item/schema";
import { delay } from "@/utils/delay";
import { jobGroups, jobs } from "../schema";
import { log, updateJobProgress } from "../service";

export async function processImdbDiscover(job: Job) {
  const parseResult = ImdbDiscoverPayloadSchema.safeParse(job.payload);
  if (!parseResult.success) {
    const error = z.prettifyError(parseResult.error);
    throw new Error(`Invalid job payload: ${error}`);
  }

  await log(job.id, "info", "Scanning chrome links for IMDb IDs");

  // 1. Find all chrome items with imdb.com links
  const linkItems = await db.query.items.findMany({
    where: (item, { eq }) => eq(item.platform, "chrome"),
  });

  const imdbIds = linkItems
    .filter((i) => i.url?.includes("imdb.com/title/"))
    .map((i) => i.url?.match(/imdb\.com\/title\/(tt\d+)/)?.[1])
    .filter((id): id is string => !!id);

  const uniqueIds = Array.from(new Set(imdbIds));

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
      try {
        await db
          .insert(jobs)
          .values({
            type: "imdb_fetch",
            status: "pending",
            resourceType: "imdb",
            resourceId: imdbId,
            payload: { imdbId },
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

export async function processImdbFetch(job: Job) {
  const parseResult = ImdbFetchPayloadSchema.safeParse(job.payload);
  if (!parseResult.success) {
    const error = z.prettifyError(parseResult.error);
    throw new Error(`Invalid job payload: ${error}`);
  }

  const { imdbId } = parseResult.data;

  await log(job.id, "info", "Fetching IMDb details", { imdbId });
  await updateJobProgress(job.id, 10);

  const [data, error] = await omdbClient.getByImdbId(imdbId);

  if (error || !data) {
    throw new Error(`OMDB fetch failed for ${imdbId}: ${error ?? "No data"}`);
  }

  await updateJobProgress(job.id, 50);

  const metadata = imdbToItem(data);

  const newItem = {
    platform: "imdb",
    externalId: imdbId,
    url: `https://www.imdb.com/title/${imdbId}/`,
    caption: data.Title,
    kind: metadata.kind,
    metadata,
  };

  const result = ItemSchemas.create.safeParse(newItem);

  if (!result.success) {
    throw new Error(`Schema validation failed for ${imdbId}: ${z.prettifyError(result.error)}`);
  }

  await db.insert(items).values(result.data);

  await log(job.id, "info", "Item imported", { imdbId, title: data.Title, type: data.Type });
  await updateJobProgress(job.id, 100);

  // Small delay to avoid OMDB rate limits when multiple workers run concurrently
  await delay(500);
}
