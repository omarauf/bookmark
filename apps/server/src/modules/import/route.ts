import fs from "node:fs/promises";
import path from "node:path";
import { ImportSchemas } from "@workspace/contracts/import";
import { parseImportFilename } from "@workspace/core/import";
import { count, eq } from "drizzle-orm";
import { db } from "@/core/db";
import { withPagination } from "@/core/db/helper/pagination";
import { protectedProcedure } from "@/lib/orpc";
import { createSingleJob } from "@/modules/job/service";
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
    })
    .handler(async ({ input: { file }, errors }) => {
      const { scrapedAt, platform } = parseImportFilename(file.name);
      if (scrapedAt === undefined || platform === undefined) throw errors.BAD_REQUEST();

      const filename = `${scrapedAt.toISOString().replace(/[:.]/g, "-")}.json`;

      const exist = await importRepo.findOne(eq(imports.filename, filename));
      if (exist) return { jobId: undefined };

      // Save file to temp directory for async processing
      await fs.mkdir(path.join(process.cwd(), "tmp"), { recursive: true });
      const tempFilePath = path.join(process.cwd(), "tmp", `import-${Date.now()}-${filename}`);
      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(tempFilePath, Buffer.from(arrayBuffer));

      // Create background job
      const job = await createSingleJob({
        type: "import_upload",
        status: "pending",
        resourceType: "import",
        payload: { tempFilePath, filename, platform, scrapedAt, size: file.size },
      });

      return { jobId: job.id };
    }),

  import: protectedProcedure
    .input(ImportSchemas.import.request)
    .output(ImportSchemas.import.response)
    .errors({ NOT_FOUND: { message: "Import not found" } })
    .handler(async ({ input: { id }, errors }) => {
      const importItem = await importRepo.findById(id);
      if (!importItem) throw errors.NOT_FOUND();

      const job = await createSingleJob({
        type: "import_process",
        status: "pending",
        resourceType: "import",
        payload: { importId: importItem.id },
      });

      return { jobId: job.id };
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
