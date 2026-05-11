import fs, { mkdir, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Job } from "@workspace/contracts/job";
import { JobPayloadSchemas } from "@workspace/contracts/job";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/core/db";
import { getMediaMetadata } from "@/core/media/ffprobe";
import { s3Client } from "@/core/s3";
import { getExtension } from "@/modules/file-manager/utils/get-extension";
import { items } from "@/modules/item/schema";
import { media } from "@/modules/media/schema";
import { ytDlpClient } from "@/modules/youtube/integrations";
import { getFileStreamAndMeta } from "@/utils/download";
import { log, updateJobProgress } from "../../service";

export async function processYoutubeDownload(job: Job) {
  const parseResult = JobPayloadSchemas.youtubeDownload.safeParse(job.payload);
  if (!parseResult.success) {
    const error = z.prettifyError(parseResult.error);
    throw new Error(`Invalid job payload: ${error}`);
  }

  const { itemId, formatId, url, ext, needsMerge } = parseResult.data;

  await log(job.id, "info", "[INIT] Starting YouTube download job", {
    itemId,
    formatId,
    url,
    needsMerge,
  });
  await updateJobProgress(job.id, 5);

  // ── 1. Resolve item ──────────────────────────────────────────────
  const item = await db.query.items.findFirst({
    where: eq(items.id, itemId),
    columns: { id: true, externalId: true, metadata: true },
  });
  if (!item) {
    throw new Error(`[INIT] Item not found for itemId: ${itemId}`);
  }

  if (item.metadata?.platform !== "youtube") {
    throw new Error(
      `[INIT] Item metadata platform mismatch. Expected "youtube", got "${item.metadata?.platform}"`,
    );
  }

  await log(job.id, "info", "[INIT] Resolved item", {
    itemId: item.id,
    externalId: item.externalId,
  });

  // ── 2. Check S3 idempotency ──────────────────────────────────────
  const s3Key = `youtube/videos/${item.externalId}_${formatId}.${ext}`;
  if (await s3Client.exists(s3Key)) {
    await log(job.id, "info", "[VIDEO] File already exists in S3, skipping download", {
      key: s3Key,
    });
    await saveMediaRecord(item.id, url, s3Key, ext, "video");
    return;
  }

  // ── 3. Download video to temp directory ──────────────────────────
  const tmpDir = join(tmpdir(), `yt-download-${job.id}`);
  await mkdir(tmpDir, { recursive: true });

  const outputTemplate = join(tmpDir, `video.%(ext)s`);
  await log(job.id, "info", "[VIDEO] Starting yt-dlp download", {
    formatId,
    url,
    needsMerge,
    outputTemplate,
  });
  await updateJobProgress(job.id, 10);

  const downloadResult = await ytDlpClient.download(
    url,
    formatId,
    outputTemplate,
    needsMerge ? "mp4" : undefined,
  );
  if (!downloadResult.ok) {
    throw new Error(`[VIDEO] yt-dlp download failed: ${downloadResult.error}`);
  }

  // Find the downloaded file
  const files = await readdir(tmpDir);
  const videoFile = files.find(
    (f) => f.startsWith("video.") && !f.endsWith(".part") && !f.endsWith(".ytdl"),
  );
  if (!videoFile) {
    throw new Error("[VIDEO] Download failed: no video file found in temp directory");
  }
  const videoPath = join(tmpDir, videoFile);

  const stats = await fs.stat(videoPath);
  await log(job.id, "info", "[VIDEO] Download complete", {
    path: videoPath,
    size: stats.size,
  });
  await updateJobProgress(job.id, 40);

  // ── 4. Upload video to S3 ────────────────────────────────────────
  const buffer = await fs.readFile(videoPath);
  await log(job.id, "info", "[VIDEO] Uploading to S3", { key: s3Key, size: stats.size });

  const [_uploadResult, uploadError] = await s3Client.upload(s3Key, buffer, (loaded, total) => {
    const percentage = Math.round((loaded / total) * 100);
    // Map upload progress from 40% to 80%
    void updateJobProgress(job.id, 40 + Math.round((percentage / 100) * 40));
  });
  if (uploadError) {
    throw new Error(`[VIDEO] S3 upload failed: ${uploadError}`);
  }
  await log(job.id, "info", "[VIDEO] S3 upload complete", { key: s3Key });

  // ── 5. Extract video metadata ────────────────────────────────────
  const probe = await getMediaMetadata(videoPath);
  let width: number | undefined;
  let height: number | undefined;
  let duration: number | undefined;

  if (probe) {
    const videoStream = probe.streams?.find((s) => s.codec_type === "video");
    width = videoStream?.width;
    height = videoStream?.height;
    duration = probe.format?.duration ? parseFloat(probe.format.duration) : undefined;
  }

  const mime = ext === "mp4" ? "video/mp4" : ext === "webm" ? "video/webm" : undefined;

  await log(job.id, "info", "[VIDEO] Metadata extracted", { width, height, duration, mime });
  await updateJobProgress(job.id, 90);

  // ── 6. Save video media record ───────────────────────────────────
  await saveMediaRecord(item.id, url, s3Key, ext, "video", {
    size: stats.size,
    width,
    height,
    duration,
    mime,
  });
  await log(job.id, "info", "[VIDEO] Media record saved", { itemId: item.id, key: s3Key });

  // ── 7. Download thumbnail ────────────────────────────────────────
  const thumbnailUrl = (item.metadata as { thumbnail?: string })?.thumbnail;
  if (thumbnailUrl) {
    await log(job.id, "info", "[THUMBNAIL] Starting thumbnail download", {
      itemId: item.id,
      thumbnailUrl,
    });
    await downloadThumbnail(job, item.id, thumbnailUrl, item.externalId);
  } else {
    await log(job.id, "warn", "[THUMBNAIL] No thumbnail URL found in metadata, skipping");
  }

  // ── 8. Cleanup ───────────────────────────────────────────────────
  await fs.unlink(videoPath).catch(() => {});
  await fs.rmdir(tmpDir).catch(() => {});
  await log(job.id, "info", "[CLEANUP] Temp files cleaned up", { tmpDir });
  await updateJobProgress(job.id, 100);
}

async function downloadThumbnail(
  job: Job,
  itemId: string,
  thumbnailUrl: string,
  externalId: string,
) {
  const ext = getExtension(thumbnailUrl) || "jpg";
  const key = `youtube/thumbnails/${externalId}.${ext}`;

  await log(job.id, "info", "[THUMBNAIL] Checking S3 idempotency", { key });

  // Idempotency check
  if (await s3Client.exists(key)) {
    await log(job.id, "info", "[THUMBNAIL] Already exists in S3, skipping", { key });

    await saveMediaRecord(itemId, thumbnailUrl, key, ext, "image", { mime: `image/${ext}` });

    return;
  }

  await log(job.id, "info", "[THUMBNAIL] Fetching from remote URL", { thumbnailUrl });

  const { stream, size, mime } = await getFileStreamAndMeta(thumbnailUrl);

  await log(job.id, "info", "[THUMBNAIL] Streaming to S3", { key, size });

  const uploadResult = await s3Client.stream(stream, key, (loaded, total) => {
    const percentage = Math.round((loaded / total) * 100);
    void updateJobProgress(job.id, Math.min(95, 90 + Math.round((percentage / 100) * 5)));
  });

  if (!uploadResult) {
    throw new Error("[THUMBNAIL] S3 upload failed");
  }

  await log(job.id, "info", "[THUMBNAIL] Upload complete", { key });

  await saveMediaRecord(itemId, thumbnailUrl, key, ext, "image", { size, mime });

  await log(job.id, "info", "[THUMBNAIL] Media record saved", { itemId, key });
}

async function saveMediaRecord(
  itemId: string,
  url: string,
  key: string,
  _ext: string,
  type: "video" | "image",
  metadata?: {
    size?: number;
    width?: number;
    height?: number;
    duration?: number;
    mime?: string;
  },
) {
  await db
    .insert(media)
    .values({
      itemId,
      url,
      key,
      platform: "youtube",
      type: type,
      createdAt: new Date(),
      mime: metadata?.mime,
      size: metadata?.size,
      width: metadata?.width,
      height: metadata?.height,
      duration: metadata?.duration,
    })
    .onConflictDoNothing();
}
