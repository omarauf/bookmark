import type { DownloadMediaPayload, Job } from "@workspace/contracts/job";
import { JobPayloadSchemas } from "@workspace/contracts/job";
import z from "zod";
import { db } from "@/core/db";
import { s3Client } from "@/core/s3";
import { ingestRepo } from "@/modules/ingest/repo";
import { parseIngest } from "@/modules/item/platform-registry";
import { ingestItems } from "@/modules/item/service/ingest";
import { jobGroups, jobs } from "../../schema";
import { log, updateJobProgress } from "../../service";

export async function processIngestProcess(job: Job) {
  const parseResult = JobPayloadSchemas.ingestProcess.safeParse(job.payload);
  if (!parseResult.success) {
    const error = z.prettifyError(parseResult.error);
    throw new Error(`Invalid job payload: ${error}`);
  }

  const payload = parseResult.data;
  const { ingestId } = payload;

  await log(job.id, "info", "Starting ingest process", { ingestId });

  const ingestItem = await ingestRepo.findById(ingestId);
  if (!ingestItem) {
    throw new Error(`Ingest item not found for id: ${ingestId}`);
  }

  await updateJobProgress(job.id, 10);

  const fileContent = await s3Client.readText(`${ingestItem.platform}/json/${ingestItem.filename}`);
  if (!fileContent) {
    throw new Error(`File not found in S3: ${ingestItem.platform}/json/${ingestItem.filename}`);
  }

  await updateJobProgress(job.id, 20);

  await log(job.id, "info", "Processing ingest file");
  const entities = parseIngest(ingestItem.platform, fileContent);

  await updateJobProgress(job.id, 30);

  await ingestItems(entities.items, entities.relations, (p) => {
    const overall = 30 + Math.round(p * 0.6);
    void updateJobProgress(job.id, overall);
  });

  await log(job.id, "info", "Items ingested", { count: entities.items.length });
  await log(job.id, "info", "Invalid items skipped", { count: entities.invalidItems.length });

  for (const task of entities.invalidItems) {
    await log(job.id, "warn", "Invalid item skipped", task);
  }

  await updateJobProgress(job.id, 92);

  if (entities.downloadTasks.length !== 0) {
    const [group] = await db
      .insert(jobGroups)
      .values({ name: `ingest-${ingestId}`, createdAt: new Date() })
      .returning();

    for (const task of entities.downloadTasks) {
      await createDownloadMediaJob(group.id, task);
    }
  }

  await updateJobProgress(job.id, 95);

  await log(job.id, "info", "Download media jobs created", {
    count: entities.downloadTasks.length,
  });

  if (ingestItem.ingestedAt === null) {
    await ingestRepo.update(ingestId, { ingestedAt: new Date() });
  }

  await updateJobProgress(job.id, 100);
}

async function createDownloadMediaJob(groupId: string, payload: DownloadMediaPayload) {
  await db
    .insert(jobs)
    .values({
      type: "download_media",
      status: "pending",
      resourceType: "media",
      resourceId: payload.key,
      payload,
      groupId,
      createdAt: new Date(),
    })
    .onConflictDoNothing();
}
