import type { DownloadMediaPayload, Job } from "@workspace/contracts/job";
import { JobPayloadSchemas } from "@workspace/contracts/job";
import z from "zod";
import { db } from "@/core/db";
import { s3Client } from "@/core/s3";
import { parseScrape } from "@/modules/item/platform-registry";
import { bulkInsertItems } from "@/modules/item/service/bulk-insert";
import { scrapeRepo } from "@/modules/scrape/repo";
import { jobs } from "../../schema";
import { log, updateJobProgress } from "../../service";

export async function processScrapeProcess(job: Job) {
  const parseResult = JobPayloadSchemas.scrapeProcess.safeParse(job.payload);
  if (!parseResult.success) {
    const error = z.prettifyError(parseResult.error);
    throw new Error(`Invalid job payload: ${error}`);
  }

  const payload = parseResult.data;
  const { scrapeId } = payload;

  await log(job.id, "info", "Starting scrape process", { scrapeId });

  const scrapeItem = await scrapeRepo.findById(scrapeId);
  if (!scrapeItem) {
    throw new Error(`Scrape item not found for id: ${scrapeId}`);
  }

  await updateJobProgress(job.id, 10);

  const fileContent = await s3Client.readText(`${scrapeItem.platform}/json/${scrapeItem.filename}`);
  if (!fileContent) {
    throw new Error(`File not found in S3: ${scrapeItem.platform}/json/${scrapeItem.filename}`);
  }

  await updateJobProgress(job.id, 20);

  await log(job.id, "info", "Processing scrape file");
  const entities = parseScrape(scrapeItem.platform, fileContent);

  await updateJobProgress(job.id, 30);

  await bulkInsertItems(entities.items, entities.relations, (p) => {
    const overall = 30 + Math.round(p * 0.6);
    void updateJobProgress(job.id, overall);
  });

  await log(job.id, "info", "Items scraped", { count: entities.items.length });
  await log(job.id, "info", "Invalid items skipped", { count: entities.invalidItems.length });

  for (const task of entities.invalidItems) {
    await log(job.id, "warn", "Invalid item skipped", task);
  }

  await updateJobProgress(job.id, 92);

  if (entities.downloadTasks.length !== 0) {
    for (const task of entities.downloadTasks) {
      await createDownloadMediaJob(scrapeId, task);
    }
  }

  await updateJobProgress(job.id, 95);

  await log(job.id, "info", "Download media jobs created", {
    count: entities.downloadTasks.length,
  });

  if (scrapeItem.processedAt === null) {
    await scrapeRepo.update(scrapeId, { processedAt: new Date() });
  }

  await updateJobProgress(job.id, 100);
}

async function createDownloadMediaJob(scrapeId: string, payload: DownloadMediaPayload) {
  await db
    .insert(jobs)
    .values({
      type: "download_media",
      status: "pending",
      resourceType: "media",
      resourceId: payload.key,
      payload,
      scrapeId,
      createdAt: new Date(),
    })
    .onConflictDoNothing();
}
