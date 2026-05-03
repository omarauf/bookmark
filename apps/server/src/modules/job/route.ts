import { JobSchemas, type JobType } from "@workspace/contracts/job";
import { and, asc, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/core/db";
import { withPagination } from "@/core/db/helper/pagination";
import { protectedProcedure } from "@/lib/orpc";
import { replaceNullWithUndefined } from "@/utils/object";
import { analyticsHandler } from "./handler/analytics";
import { jobRepo } from "./repo";
import { jobGroups, jobLogs, jobs } from "./schema";
import { reclaimStaleJobs } from "./worker/reclaimer";

export const jobRouter = {
  list: protectedProcedure
    .input(JobSchemas.list.request)
    .output(JobSchemas.list.response)
    .handler(async ({ input }) => {
      const { type, status, resourceType, resourceId, groupId } = input;

      const filters = and(
        type ? eq(jobs.type, type) : undefined,
        status ? eq(jobs.status, status) : undefined,
        resourceType ? eq(jobs.resourceType, resourceType) : undefined,
        resourceId ? eq(jobs.resourceId, resourceId) : undefined,
        groupId ? eq(jobs.groupId, groupId) : undefined,
      );

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
    .handler(async ({ input: { jobId } }) => {
      const dataQuery = await db
        .select()
        .from(jobLogs)
        .where(eq(jobLogs.jobId, jobId))
        .orderBy(asc(jobLogs.createdAt));

      return dataQuery;
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
      const job = await jobRepo.findById(id);
      if (!job) throw errors.NOT_FOUND();

      const [updated] = await db
        .update(jobs)
        .set({ status: "cancelled", cancelledAt: new Date() })
        .where(and(eq(jobs.id, id), inArray(jobs.status, ["pending", "processing", "retrying"])))
        .returning();

      if (!updated) throw errors.BAD_REQUEST();

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
        .where(where)
        .groupBy(jobs.status);

      const typeRows = await db
        .select({ type: jobs.type, count: count() })
        .from(jobs)
        .where(where)
        .groupBy(jobs.type);

      const result = {
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        cancelled: 0,
        retrying: 0,
        byType: {} as Record<JobType, number>,
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

  group: {
    list: protectedProcedure
      .input(JobSchemas.group.list.request)
      .output(JobSchemas.group.list.response)
      .handler(async ({ input }) => {
        const dataQuery = db.select().from(jobGroups);
        const countQuery = db.select({ count: count() }).from(jobGroups);

        return await withPagination({
          dataQuery,
          countQuery,
          page: input.page,
          perPage: input.perPage,
          orderByColumn: desc(jobGroups.createdAt),
        });
      }),

    get: protectedProcedure
      .input(JobSchemas.group.get.request)
      .output(JobSchemas.group.get.response)
      .errors({ NOT_FOUND: { message: "Job group not found" } })
      .handler(async ({ input, errors }) => {
        const { id, status, type } = input;
        const [group] = await db.select().from(jobGroups).where(eq(jobGroups.id, id)).limit(1);
        if (!group) throw errors.NOT_FOUND();

        const dataQuery = db.select().from(jobs);
        const countQuery = db.select({ count: count() }).from(jobs);

        console.log("Group ID:", id, status);

        const filters = and(
          eq(jobs.groupId, id),
          type ? eq(jobs.type, type) : undefined,
          status ? eq(jobs.status, status) : undefined,
        );

        const jobsResult = await withPagination({
          dataQuery,
          countQuery,
          filters: filters,
          page: input.page,
          perPage: input.perPage,
          orderByColumn: desc(jobs.createdAt),
        });

        return {
          group,
          jobs: jobsResult,
        };
      }),

    stats: protectedProcedure
      .input(JobSchemas.group.stats.request)
      .output(JobSchemas.group.stats.response)
      .handler(async ({ input: { groupId } }) => {
        const statusRows = await db
          .select({ status: jobs.status, count: count() })
          .from(jobs)
          .where(eq(jobs.groupId, groupId))
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
  },

  analytics: analyticsHandler,
};
