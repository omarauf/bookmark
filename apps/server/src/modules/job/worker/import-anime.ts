import { ItemSchemas } from "@workspace/contracts/item";
import type { Job } from "@workspace/contracts/job";
import { AnimeDiscoverPayloadSchema, AnimeFetchPayloadSchema } from "@workspace/contracts/job";
import z from "zod";
import { db } from "@/core/db";
import { malClient } from "@/modules/anime/integrations/mal";
import { malToItem } from "@/modules/anime/service";
import { items } from "@/modules/item/schema";
import { relations } from "@/modules/relation/schema";
import { delay } from "@/utils/delay";
import { jobGroups, jobs } from "../schema";
import { log, updateJobProgress } from "../service";

export async function processAnimeDiscover(job: Job) {
  const parseResult = AnimeDiscoverPayloadSchema.safeParse(job.payload);
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
      try {
        await db
          .insert(jobs)
          .values({
            type: "anime_fetch",
            status: "pending",
            resourceType: "anime",
            resourceId: animeId,
            payload: { animeId, linkId: animeIdToLinkId.get(animeId) },
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

export async function processAnimeFetch(job: Job) {
  const parseResult = AnimeFetchPayloadSchema.safeParse(job.payload);
  if (!parseResult.success) {
    const error = z.prettifyError(parseResult.error);
    throw new Error(`Invalid job payload: ${error}`);
  }

  const { animeId, linkId } = parseResult.data;

  await log(job.id, "info", "Fetching MyAnimeList details", { animeId, linkId });
  await updateJobProgress(job.id, 10);

  const [data, error] = await malClient.getByAnimeId(animeId);

  if (error || !data) {
    throw new Error(`MAL fetch failed for ${animeId}: ${error ?? "No data"}`);
  }

  await updateJobProgress(job.id, 50);

  const metadata = malToItem(data);

  const newItem = {
    platform: "mal" as const,
    externalId: animeId,
    url: `https://myanimelist.net/anime/${animeId}/`,
    caption: data.title,
    kind: "anime" as const,
    metadata,
  };

  const result = ItemSchemas.create.safeParse(newItem);

  if (!result.success) {
    throw new Error(`Schema validation failed for ${animeId}: ${z.prettifyError(result.error)}`);
  }

  const [{ id: newItemId }] = await db
    .insert(items)
    .values(result.data)
    .returning({ id: items.id });

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
    animeId,
    title: data.title,
    type: data.media_type,
  });
  await updateJobProgress(job.id, 100);

  await delay(500);
}
