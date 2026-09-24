import fs from "node:fs/promises";
import path from "node:path";
import { ScrapeSchemas } from "@workspace/contracts/scrape";
import { parseScrapeFilename } from "@workspace/core/scrape";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/core/db";
import { withPagination } from "@/core/db/helper/pagination";
import { protectedProcedure } from "@/lib/orpc";
import { jobs } from "@/modules/job/schema";
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
        scrapeId: scrapeItem.id,
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

  jobs: protectedProcedure
    .input(ScrapeSchemas.jobs.request)
    .output(ScrapeSchemas.jobs.response)
    .handler(async ({ input }) => {
      const filters = eq(jobs.scrapeId, input.id);

      const dataQuery = db.select().from(jobs);
      const countQuery = db.select({ count: count() }).from(jobs);

      return await withPagination({
        dataQuery,
        countQuery,
        filters,
        page: input.page,
        perPage: input.perPage,
        orderByColumn: desc(jobs.createdAt),
      });
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

  stats: protectedProcedure
    .input(ScrapeSchemas.stats.request)
    .output(ScrapeSchemas.stats.response)
    .handler(async ({ input: { id } }) => {
      const statusRows = await db
        .select({ status: jobs.status, count: count() })
        .from(jobs)
        .where(eq(jobs.scrapeId, id))
        .groupBy(jobs.status);

      const result = {
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        cancelled: 0,
        retrying: 0,
      };

      for (const row of statusRows) {
        const value = Number(row.count);
        result.total += value;
        if (row.status in result) {
          result[row.status] = value;
        }
      }

      return result;
    }),

  cancel: protectedProcedure
    .input(ScrapeSchemas.cancel.request)
    .output(ScrapeSchemas.cancel.response)
    .errors({ NOT_FOUND: { message: "Scrape not found" } })
    .handler(async ({ input: { id }, errors }) => {
      const [scrape] = await db
        .select({ id: scrapes.id })
        .from(scrapes)
        .where(eq(scrapes.id, id))
        .limit(1);
      if (!scrape) throw errors.NOT_FOUND();

      const cancelled = await db
        .update(jobs)
        .set({ status: "cancelled", cancelledAt: new Date(), retryAt: null })
        .where(
          and(eq(jobs.scrapeId, id), inArray(jobs.status, ["pending", "processing", "retrying"])),
        )
        .returning({ id: jobs.id });

      return { cancelled: cancelled.length };
    }),
};
