import { ImportSchemas } from "@workspace/contracts/import";
import { parseImportFilename } from "@workspace/core/import";
import { count, eq } from "drizzle-orm";
import { db } from "@/core/db";
import { withPagination } from "@/core/db/helper/pagination";
import { s3Client } from "@/core/s3";
import { protectedProcedure } from "@/lib/orpc";
import { addDownloadTask } from "../download-task/service";
import { itemOrchestrator } from "../item/orchestrator";
import { importItems } from "../item/service/import";
import { importRepo } from "./repo";
import { imports } from "./schema";

export const importRouter = {
  list: protectedProcedure
    .input(ImportSchemas.list.request)
    .output(ImportSchemas.list.response)
    .handler(async ({ input }) => {
      const filters = input.platform ? eq(imports.platform, input.platform) : undefined;

      const dataQuery = db.select().from(imports);

      const countQuery = db.select({ count: count() }).from(imports);

      return await withPagination({
        dataQuery,
        countQuery,
        filters,
        page: input.page,
        perPage: input.perPage,
        orderByColumn: imports.scrapedAt,
        orderDirection: "desc",
      });
    }),

  create: protectedProcedure
    .route({ path: "/import" })
    .input(ImportSchemas.create.request)
    .output(ImportSchemas.create.response)
    .errors({
      BAD_REQUEST: {
        message: "Invalid filename format. Expected format: {platform}_YYYY-MM-DD_HH-MM-SS.json",
      },
      INTERNAL_SERVER_ERROR: { message: "Failed to upload file to S3" },
    })
    .handler(async ({ input: { file }, errors }) => {
      const { scrapedAt, platform } = parseImportFilename(file.name);
      if (scrapedAt === undefined || platform === undefined) throw errors.BAD_REQUEST();

      const filename = `${scrapedAt.toISOString().replace(/[:.]/g, "-")}.json`;

      const exist = await importRepo.findOne(eq(imports.filename, filename));

      if (exist) {
        console.log(`Import with filename ${filename} already exists, updating existing record.`);
        await importRepo.update(exist.id, { platform, scrapedAt, size: file.size });
        return;
      }

      // Run heavy extraction, validation and upload in the background
      (async () => {
        try {
          const s3Key = `${platform}/json/${filename}`;
          const fileExistsInS3 = await s3Client.exists(s3Key);

          if (fileExistsInS3) {
            console.log(`File ${s3Key} already exists in S3, skipping upload.`);
          }

          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          if (!fileExistsInS3) {
            console.log(`Uploading file ${s3Key} to S3...`);
            const [_, s3Error] = await s3Client.upload(s3Key, buffer);

            if (s3Error) {
              console.error("Failed to upload file to S3:", s3Error);
              return;
            }
          }

          const data = buffer.toString("utf-8");
          const parsedData = itemOrchestrator.validate(platform, data);

          await importRepo.create({
            filename: filename,
            validPost: parsedData.valid,
            invalidPost: parsedData.invalid,
            size: file.size,
            platform,
            scrapedAt,
          });
        } catch (error) {
          console.error("Background import processing failed:", error);
        }
      })();
    }),

  import: protectedProcedure
    .input(ImportSchemas.import.request)
    .output(ImportSchemas.import.response)
    .errors({ NOT_FOUND: { message: "Import not found" } })
    .handler(async ({ input: { id }, errors }) => {
      const importItem = await importRepo.findById(id);
      if (!importItem) throw errors.NOT_FOUND();

      const fileContent = await s3Client.readText(
        `${importItem.platform}/json/${importItem.filename}`,
      );
      if (!fileContent) throw errors.NOT_FOUND();

      const entities = itemOrchestrator.process(importItem.platform, fileContent);
      await importItems(entities.items, entities.relations);
      await addDownloadTask(entities.downloadTasks);

      if (importItem.importedAt === null) {
        await importRepo.update(id, { importedAt: new Date() });
      }

      return { valid: entities.items.length };
    }),

  delete: protectedProcedure
    .input(ImportSchemas.delete.request)
    .output(ImportSchemas.delete.response)
    .errors({ NOT_FOUND: { message: "Import not found" } })
    .handler(async ({ input: { id }, errors }) => {
      const importItem = await importRepo.findById(id);
      if (!importItem) throw errors.NOT_FOUND();
      await importRepo.delete(id);
    }),
};
