import type { DownloadMediaPayload, Job } from "@workspace/contracts/job";
import { JobPayloadSchemas } from "@workspace/contracts/job";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/core/db";
import { s3Client } from "@/core/s3";
import { items } from "@/modules/item/schema";
import { media } from "@/modules/media/schema";
import { getFileStreamAndMeta } from "@/utils/download";
import { log, updateJobProgress } from "../../service";

export async function processDownloadMedia(job: Job) {
  const parseResult = JobPayloadSchemas.downloadMedia.safeParse(job.payload);
  if (!parseResult.success) {
    const error = z.prettifyError(parseResult.error);
    throw new Error(`Invalid job payload: ${error}`);
  }

  const payload = parseResult.data;
  const { url, key, externalId } = payload;

  await log(job.id, "info", "Starting download media processing", { key, url });

  // 1. Resolve item id from externalId
  const itemId = await getItemId(externalId);
  if (!itemId) {
    throw new Error(`Item not found for externalId: ${externalId}`);
  }
  await log(job.id, "info", "Resolved item", { itemId });

  // 2. Check S3 idempotency
  if (await s3Client.exists(key)) {
    await log(job.id, "info", "File already exists in S3, skipping download", { key });
    await saveMediaRecord(payload, itemId);
    return;
  }

  // 3. Download and upload
  await log(job.id, "info", "Downloading from URL", { url });
  const { stream, size, mime } = await getFileStreamAndMeta(url);
  await log(job.id, "info", "Download started", { size, mime });

  const uploadResult = await s3Client.stream(stream, key, (loaded, total) => {
    const percentage = Math.round((loaded / total) * 100);
    void updateJobProgress(job.id, percentage);
  });
  if (!uploadResult) {
    throw new Error("S3 upload failed");
  }
  await log(job.id, "info", "S3 upload complete", { key });

  // 4. Save media record
  await saveMediaRecord(payload, itemId, { size, mime });
  await log(job.id, "info", "Media record saved", { itemId });
}

async function getItemId(externalId: string) {
  const item = await db.query.items.findFirst({
    where: eq(items.externalId, externalId),
    columns: { id: true },
  });
  return item?.id;
}

async function saveMediaRecord(
  payload: DownloadMediaPayload,
  itemId: string,
  metadata?: {
    size?: number;
    mime?: string;
    width?: number;
    height?: number;
    duration?: number;
  },
) {
  const meta = {
    size: metadata?.size ?? payload.size,
    mime: metadata?.mime,
    width: metadata?.width ?? payload.width,
    height: metadata?.height ?? payload.height,
    duration: payload.type === "video" ? (metadata?.duration ?? payload.duration ?? null) : null,
  };

  await db
    .insert(media)
    .values({
      url: payload.url,
      key: payload.key,
      platform: payload.platform,
      type: payload.type,
      itemId: itemId,
      createdAt: new Date(),
      mime: meta.mime,
      size: meta.size,
      width: meta.width,
      height: meta.height,
      duration: meta.duration,
    })
    .onConflictDoNothing();
}
