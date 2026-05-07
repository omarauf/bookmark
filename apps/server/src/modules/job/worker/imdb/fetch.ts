import { ItemSchemas } from "@workspace/contracts/item";
import type { Job } from "@workspace/contracts/job";
import { JobPayloadSchemas } from "@workspace/contracts/job";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/core/db";
import { omdbClient } from "@/modules/imdb/integrations/omdb";
import { imdbToItem } from "@/modules/imdb/service";
import { items } from "@/modules/item/schema";
import { delay } from "@/utils/delay";
import { log, updateJobProgress } from "../../service";

export async function processImdbFetch(job: Job) {
  const parseResult = JobPayloadSchemas.imdbFetch.safeParse(job.payload);
  if (!parseResult.success) {
    const error = z.prettifyError(parseResult.error);
    throw new Error(`Invalid job payload: ${error}`);
  }

  const { imdbId, linkId } = parseResult.data;

  await log(job.id, "info", "Fetching IMDb details", { imdbId, linkId });
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
    await log(job.id, "error", `Failed to parse IMDb item for ${imdbId}`, { data });
    throw new Error(`Schema validation failed for ${imdbId}: ${z.prettifyError(result.error)}`);
  }

  await db.transaction(async (tx) => {
    await tx.insert(items).values(result.data).returning({ id: items.id });
    await tx.delete(items).where(eq(items.id, linkId));
  });

  await log(job.id, "info", "Item imported", { imdbId, title: data.Title, type: data.Type });
  await updateJobProgress(job.id, 100);

  // Small delay to avoid OMDB rate limits when multiple workers run concurrently
  await delay(500);
}
