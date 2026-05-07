import { ItemSchemas } from "@workspace/contracts/item";
import type { Job } from "@workspace/contracts/job";
import { JobPayloadSchemas } from "@workspace/contracts/job";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/core/db";
import { malClient } from "@/modules/anime/integrations/mal";
import { malToItem } from "@/modules/anime/service";
import { items } from "@/modules/item/schema";
import { delay } from "@/utils/delay";
import { log, updateJobProgress } from "../../service";

export async function processAnimeFetch(job: Job) {
  const parseResult = JobPayloadSchemas.animeFetch.safeParse(job.payload);
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

  await db.transaction(async (tx) => {
    await tx.insert(items).values(result.data).returning({ id: items.id });
    await tx.delete(items).where(eq(items.id, linkId));
  });

  await log(job.id, "info", "Item imported", {
    animeId,
    title: data.title,
    type: data.media_type,
  });
  await updateJobProgress(job.id, 100);

  await delay(500);
}
