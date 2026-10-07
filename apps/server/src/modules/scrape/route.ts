import fs from "node:fs/promises";
import path from "node:path";
import { ScrapeSchemas } from "@workspace/contracts/scrape";
import { parseScrapeFilename } from "@workspace/core/scrape";
import { count, eq } from "drizzle-orm";
import { db } from "@/core/db";
import { withPagination } from "@/core/db/helper/pagination";
import { s3Client } from "@/core/s3";
import { protectedProcedure } from "@/lib/orpc";
import { createSingleJob } from "@/modules/job/service";
import { replaceNullWithUndefined } from "@/utils/object";
import { scrapeRepo } from "./repo";
import { scrapes } from "./schema";

export const scrapeRouter = {
  list: protectedProcedure
    .input(ScrapeSchemas.list.request)
    .output(ScrapeSchemas.list.response)
    .handler(async ({ input }) => {
      const filters = input.platform ? eq(scrapes.platform, input.platform) : undefined;

      const dataQuery = db.select().from(scrapes);

      const countQuery = db.select({ count: count() }).from(scrapes);

      return await withPagination({
        dataQuery,
        countQuery,
        filters,
        page: input.page,
        perPage: input.perPage,
        orderByColumn: scrapes.scrapedAt,
        orderDirection: "desc",
      });
    }),

  create: protectedProcedure
    .route({ path: "/scrape" })
    .input(ScrapeSchemas.create.request)
    .output(ScrapeSchemas.create.response)
    .errors({
      BAD_REQUEST: {
        message: "Invalid filename format. Expected format: {platform}_YYYY-MM-DD_HH-MM-SS.json",
      },
    })
    .handler(async ({ input: { file }, errors }) => {
      const { scrapedAt, platform } = parseScrapeFilename(file.name);
      if (scrapedAt === undefined || platform === undefined) throw errors.BAD_REQUEST();

      const filename = `${scrapedAt.toISOString().replace(/[:.]/g, "-")}.json`;

      const exist = await scrapeRepo.findOne(eq(scrapes.filename, filename));
      if (exist) return { jobId: undefined };

      // Save file to temp directory for async processing
      await fs.mkdir(path.join(process.cwd(), "tmp"), { recursive: true });
      const tempFilePath = path.join(process.cwd(), "tmp", `scrape-${Date.now()}-${filename}`);
      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(tempFilePath, Buffer.from(arrayBuffer));

      // Create background job
      const job = await createSingleJob({
        type: "scrape_upload",
        status: "pending",
        resourceType: "scrape",
        payload: { tempFilePath, filename, platform, scrapedAt, size: file.size },
      });

      return { jobId: job.id };
    }),

  process: protectedProcedure
    .input(ScrapeSchemas.process.request)
    .output(ScrapeSchemas.process.response)
    .errors({ NOT_FOUND: { message: "Scrape not found" } })
    .handler(async ({ input: { id }, errors }) => {
      const scrapeItem = await scrapeRepo.findById(id);
      if (!scrapeItem) throw errors.NOT_FOUND();

      const job = await createSingleJob({
        type: "scrape_process",
        status: "pending",
        resourceType: "scrape",
        payload: { scrapeId: scrapeItem.id },
      });

      return { jobId: job.id };
    }),

  get: protectedProcedure
    .input(ScrapeSchemas.get.request)
    .output(ScrapeSchemas.get.response)
    .errors({ NOT_FOUND: { message: "Scrape not found" } })
    .handler(async ({ input: { id }, errors }) => {
      const scrapeItem = await scrapeRepo.findById(id);
      if (!scrapeItem) throw errors.NOT_FOUND();
      return replaceNullWithUndefined(scrapeItem);
    }),

  content: protectedProcedure
    .input(ScrapeSchemas.content.request)
    .output(ScrapeSchemas.content.response)
    .errors({
      NOT_FOUND: { message: "Scrape not found" },
      FILE_UNAVAILABLE: { status: 502, message: "Could not read the scrape file from S3" },
    })
    .handler(async ({ input: { id }, errors }) => {
      const scrapeItem = await scrapeRepo.findById(id);
      if (!scrapeItem) throw errors.NOT_FOUND();

      const content = await s3Client.readText(`${scrapeItem.platform}/json/${scrapeItem.filename}`);
      if (content === undefined) throw errors.FILE_UNAVAILABLE();
      return { content };
    }),

  delete: protectedProcedure
    .input(ScrapeSchemas.delete.request)
    .output(ScrapeSchemas.delete.response)
    .errors({ NOT_FOUND: { message: "Scrape not found" } })
    .handler(async ({ input: { id }, errors }) => {
      const scrapeItem = await scrapeRepo.findById(id);
      if (!scrapeItem) throw errors.NOT_FOUND();
      await scrapeRepo.delete(id);
    }),
};
