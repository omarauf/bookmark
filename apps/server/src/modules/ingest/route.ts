import fs from "node:fs/promises";
import path from "node:path";
import { IngestSchemas } from "@workspace/contracts/ingest";
import { parseIngestFilename } from "@workspace/core/ingest";
import { count, eq } from "drizzle-orm";
import { db } from "@/core/db";
import { withPagination } from "@/core/db/helper/pagination";
import { protectedProcedure } from "@/lib/orpc";
import { createSingleJob } from "@/modules/job/service";
import { ingestRepo } from "./repo";
import { ingests } from "./schema";

export const ingestRouter = {
  list: protectedProcedure
    .input(IngestSchemas.list.request)
    .output(IngestSchemas.list.response)
    .handler(async ({ input }) => {
      const filters = input.platform ? eq(ingests.platform, input.platform) : undefined;

      const dataQuery = db.select().from(ingests);

      const countQuery = db.select({ count: count() }).from(ingests);

      return await withPagination({
        dataQuery,
        countQuery,
        filters,
        page: input.page,
        perPage: input.perPage,
        orderByColumn: ingests.scrapedAt,
        orderDirection: "desc",
      });
    }),

  create: protectedProcedure
    .route({ path: "/ingest" })
    .input(IngestSchemas.create.request)
    .output(IngestSchemas.create.response)
    .errors({
      BAD_REQUEST: {
        message: "Invalid filename format. Expected format: {platform}_YYYY-MM-DD_HH-MM-SS.json",
      },
    })
    .handler(async ({ input: { file }, errors }) => {
      const { scrapedAt, platform } = parseIngestFilename(file.name);
      if (scrapedAt === undefined || platform === undefined) throw errors.BAD_REQUEST();

      const filename = `${scrapedAt.toISOString().replace(/[:.]/g, "-")}.json`;

      const exist = await ingestRepo.findOne(eq(ingests.filename, filename));
      if (exist) return { jobId: undefined };

      // Save file to temp directory for async processing
      await fs.mkdir(path.join(process.cwd(), "tmp"), { recursive: true });
      const tempFilePath = path.join(process.cwd(), "tmp", `ingest-${Date.now()}-${filename}`);
      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(tempFilePath, Buffer.from(arrayBuffer));

      // Create background job
      const job = await createSingleJob({
        type: "ingest_upload",
        status: "pending",
        resourceType: "ingest",
        payload: { tempFilePath, filename, platform, scrapedAt, size: file.size },
      });

      return { jobId: job.id };
    }),

  ingest: protectedProcedure
    .input(IngestSchemas.ingest.request)
    .output(IngestSchemas.ingest.response)
    .errors({ NOT_FOUND: { message: "Ingest not found" } })
    .handler(async ({ input: { id }, errors }) => {
      const ingestItem = await ingestRepo.findById(id);
      if (!ingestItem) throw errors.NOT_FOUND();

      const job = await createSingleJob({
        type: "ingest_process",
        status: "pending",
        resourceType: "ingest",
        payload: { ingestId: ingestItem.id },
      });

      return { jobId: job.id };
    }),

  delete: protectedProcedure
    .input(IngestSchemas.delete.request)
    .output(IngestSchemas.delete.response)
    .errors({ NOT_FOUND: { message: "Ingest not found" } })
    .handler(async ({ input: { id }, errors }) => {
      const ingestItem = await ingestRepo.findById(id);
      if (!ingestItem) throw errors.NOT_FOUND();
      await ingestRepo.delete(id);
    }),
};
