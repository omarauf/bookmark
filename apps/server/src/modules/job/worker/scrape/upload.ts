import fs from "node:fs/promises";
import { type Job, JobPayloadSchemas } from "@workspace/contracts/job";
import z from "zod";
import { s3Client } from "@/core/s3";
import { validateScrape } from "@/modules/item/platform-registry";
import { scrapeRepo } from "@/modules/scrape/repo";
import { log, updateJobProgress } from "../../service";

export async function processScrapeUpload(job: Job) {
  const parseResult = JobPayloadSchemas.scrapeUpload.safeParse(job.payload);
  if (!parseResult.success) {
    const error = z.prettifyError(parseResult.error);
    throw new Error(`Invalid job payload: ${error}`);
  }

  const payload = parseResult.data;
  const { tempFilePath, filename, platform, scrapedAt, size } = payload;

  const s3Key = `${platform}/json/${filename}`;

  await log(job.id, "info", "Starting scrape upload processing", { s3Key });

  // 1. Read temp file
  const buffer = await fs.readFile(tempFilePath);
  await log(job.id, "info", "Read temp file", { size: buffer.length });

  // 2. Check S3 idempotency
  const exists = await s3Client.exists(s3Key);
  if (exists) {
    await log(job.id, "info", "File already exists in S3, skipping upload", { s3Key });
  } else {
    await log(job.id, "info", "Uploading to S3", { s3Key });
    const [_, s3Error] = await s3Client.upload(s3Key, buffer, (loaded, total) => {
      const percentage = Math.round((loaded / total) * 100);
      void updateJobProgress(job.id, percentage);
    });
    if (s3Error) {
      throw new Error(`S3 upload failed: ${s3Error}`);
    }
    await log(job.id, "info", "S3 upload complete", { s3Key });
  }

  // 3. Validate content
  const data = buffer.toString("utf-8");
  await log(job.id, "info", "Validating content");
  const parsedData = validateScrape(platform, data);
  await log(job.id, "info", "Validation complete", parsedData);

  // 4. Create scrape record
  const scrapeItem = await scrapeRepo.create({
    filename,
    validPost: parsedData.valid,
    invalidPost: parsedData.invalid,
    size,
    platform: platform,
    scrapedAt: new Date(scrapedAt),
  });
  await log(job.id, "info", "Scrape record created", { filename, scrapeId: scrapeItem.id });

  // 5. Clean up temp file
  await fs.unlink(tempFilePath).catch(() => {});
  await log(job.id, "info", "Temp file cleaned up", { tempFilePath });
}
