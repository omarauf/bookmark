import { JobSchemas } from "@workspace/contracts/job";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { replaceNullWithUndefined } from "@/utils/object";
import { jobRepo } from "./repo";
import { jobLogs, jobs } from "./schema";
import { reclaimStaleJobs } from "./worker/reclaimer";

export const jobRouter = {
  list: protectedProcedure
    .input(JobSchemas.list.request)
    .output(JobSchemas.list.response)
    .handler(async ({ input }) => {
      const { page = 1, perPage = 40, type, status, resourceType, resourceId } = input;
      const offset = (page - 1) * perPage;

      const conditions = [];
      if (type) conditions.push(eq(jobs.type, type));
      if (status) conditions.push(eq(jobs.status, status));
      if (resourceType) conditions.push(eq(jobs.resourceType, resourceType));
      if (resourceId) conditions.push(eq(jobs.resourceId, resourceId));

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [items, [{ total }]] = await Promise.all([
        db
          .select()
          .from(jobs)
          .where(where ?? sql`TRUE`)
          .orderBy(desc(jobs.createdAt))
          .limit(perPage)
          .offset(offset),
        db
          .select({ total: count() })
          .from(jobs)
          .where(where ?? sql`TRUE`),
      ]);

      const totalPages = Math.ceil(total / perPage);

      return {
        items: items.map(replaceNullWithUndefined),
        total,
        page,
        perPage,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    }),

  get: protectedProcedure
    .input(JobSchemas.get.request)
    .output(JobSchemas.get.response)
    .errors({ NOT_FOUND: { message: "Job not found" } })
    .handler(async ({ input: { id }, errors }) => {
      const [job] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
      if (!job) throw errors.NOT_FOUND();

      return replaceNullWithUndefined(job);
    }),

  logs: protectedProcedure
    .input(JobSchemas.logs.request)
    .output(JobSchemas.logs.response)
    .handler(async ({ input }) => {
      const { jobId, level, page = 1, perPage = 40 } = input;
      const offset = (page - 1) * perPage;

      const where = level
        ? and(eq(jobLogs.jobId, jobId), eq(jobLogs.level, level))
        : eq(jobLogs.jobId, jobId);

      const [rows, [{ total }]] = await Promise.all([
        db
          .select()
          .from(jobLogs)
          .where(where)
          .orderBy(asc(jobLogs.createdAt))
          .limit(perPage)
          .offset(offset),
        db.select({ total: count() }).from(jobLogs).where(where),
      ]);

      const totalPages = Math.ceil(total / perPage);

      return {
        items: rows,
        total,
        page,
        perPage,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    }),

  retry: protectedProcedure
    .input(JobSchemas.retry.request)
    .output(JobSchemas.retry.response)
    .errors({
      NOT_FOUND: { message: "Job not found" },
      BAD_REQUEST: { message: "Job cannot be retried in its current state" },
      INTERNAL_ERROR: { message: "Failed to retry job" },
    })
    .handler(async ({ input: { id }, errors }) => {
      const job = await jobRepo.findById(id);
      if (!job) throw errors.NOT_FOUND();

      if (job.status !== "failed" && job.status !== "cancelled") {
        throw errors.BAD_REQUEST();
      }

      const updated = await jobRepo.update(id, {
        status: "pending",
        error: null,
        errorDetail: null,
        failedAt: null,
        retryAt: null,
      });

      if (!updated) throw errors.INTERNAL_ERROR();

      return replaceNullWithUndefined(updated);
    }),

  cancel: protectedProcedure
    .input(JobSchemas.cancel.request)
    .output(JobSchemas.cancel.response)
    .errors({
      NOT_FOUND: { message: "Job not found" },
      BAD_REQUEST: { message: "Job cannot be cancelled in its current state" },
    })
    .handler(async ({ input: { id }, errors }) => {
      const [job] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
      if (!job) throw errors.NOT_FOUND();

      if (job.status !== "pending" && job.status !== "processing" && job.status !== "retrying") {
        throw errors.BAD_REQUEST();
      }

      await jobRepo.update(id, { status: "cancelled", cancelledAt: new Date() });

      const [updated] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
      if (!updated) throw errors.NOT_FOUND();

      return replaceNullWithUndefined(updated);
    }),

  reclaimStale: protectedProcedure
    .input(JobSchemas.reclaimStale.request)
    .output(JobSchemas.reclaimStale.response)
    .handler(async ({ input }) => {
      const reclaimed = await reclaimStaleJobs(input?.stalledMinutes);
      return { reclaimed };
    }),

  stats: protectedProcedure
    .input(JobSchemas.stats.request)
    .output(JobSchemas.stats.response)
    .handler(async ({ input }) => {
      const type = input?.type;
      const where = type ? eq(jobs.type, type) : undefined;

      const statusRows = await db
        .select({ status: jobs.status, count: count() })
        .from(jobs)
        .where(where ?? sql`TRUE`)
        .groupBy(jobs.status);

      const typeRows = await db
        .select({ type: jobs.type, count: count() })
        .from(jobs)
        .where(where ?? sql`TRUE`)
        .groupBy(jobs.type);

      const result = {
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        cancelled: 0,
        retrying: 0,
        byType: {} as Record<string, number>,
      };

      for (const row of statusRows) {
        const value = Number(row.count);
        result.total += value;
        if (row.status in result) {
          result[row.status as keyof typeof result] = value as never;
        }
      }

      for (const row of typeRows) {
        result.byType[row.type] = Number(row.count);
      }

      return result;
    }),
};
