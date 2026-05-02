import type { DownloadMediaPayload, Job } from "@workspace/contracts/job";
import { ImportProcessPayloadSchema } from "@workspace/contracts/job";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/core/db";
import { s3Client } from "@/core/s3";
import { importRepo } from "@/modules/import/repo";
import { parseImport } from "@/modules/item/platform-registry";
import { importItems } from "@/modules/item/service/import";
import { jobGroups, jobs } from "../schema";
import { log, updateJobProgress } from "../service";

export async function processImportProcess(job: Job) {
  const parseResult = ImportProcessPayloadSchema.safeParse(job.payload);
  if (!parseResult.success) {
    const error = z.prettifyError(parseResult.error);
    throw new Error(`Invalid job payload: ${error}`);
  }

  const payload = parseResult.data;
  const { importId } = payload;

  await log(job.id, "info", "Starting import process", { importId });

  const importItem = await importRepo.findById(importId);
  if (!importItem) {
    throw new Error(`Import item not found for id: ${importId}`);
  }

  await updateJobProgress(job.id, 10);

  const fileContent = await s3Client.readText(`${importItem.platform}/json/${importItem.filename}`);
  if (!fileContent) {
    throw new Error(`File not found in S3: ${importItem.platform}/json/${importItem.filename}`);
  }

  await updateJobProgress(job.id, 20);

  await log(job.id, "info", "Processing import file");
  const entities = parseImport(importItem.platform, fileContent);

  await updateJobProgress(job.id, 30);

  await importItems(entities.items, entities.relations, (p) => {
    const overall = 30 + Math.round(p * 0.6);
    void updateJobProgress(job.id, overall);
  });

  await log(job.id, "info", "Items imported", { count: entities.items.length });

  for (const task of entities.invalidItems) {
    await log(job.id, "warn", "Invalid item skipped", task);
  }

  await updateJobProgress(job.id, 92);

  const [group] = await db
    .insert(jobGroups)
    .values({ name: `import-${importId}`, createdAt: new Date() })
    .returning();

  for (const task of entities.downloadTasks) {
    await createDownloadMediaJob(group.id, task);
  }

  await updateJobProgress(job.id, 95);

  await log(job.id, "info", "Download media jobs created", {
    count: entities.downloadTasks.length,
  });

  if (importItem.importedAt === null) {
    await importRepo.update(importId, { importedAt: new Date() });
  }

  await updateJobProgress(job.id, 100);
}

export async function createDownloadMediaJob(groupId: string, payload: DownloadMediaPayload) {
  const existingCompleted = await db
    .select({ id: jobs.id })
    .from(jobs)
    .where(
      and(
        eq(jobs.type, "download_media"),
        eq(jobs.resourceId, payload.key),
        eq(jobs.status, "completed"),
      ),
    )
    .limit(1);

  if (existingCompleted.length > 0) {
    return null;
  }

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
