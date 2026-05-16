import { z } from "zod";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
} from "../../foundation/pagination-query";
import { JobGroupSchema, JobLogSchema, JobSchema } from "./entity";
import { JobStatusEnum, JobTypeEnum } from "./enum";

export const JobSchemas = {
  list: {
    request: BasePaginationQuerySchema.extend({
      type: JobTypeEnum.optional().catch(undefined),
      types: JobTypeEnum.array().optional().catch(undefined),
      status: JobStatusEnum.optional().catch(undefined),
      resourceType: z.string().optional().catch(undefined),
      resourceId: z.string().optional().catch(undefined),
      groupId: z.uuid().optional().catch(undefined),
    }),
    response: PaginationResultSchema(JobSchema),
  },

  get: {
    request: z.object({ id: z.uuid() }),
    response: JobSchema,
  },

  logs: {
    request: z.object({ jobId: z.uuid() }),
    response: JobLogSchema.array(),
  },

  retry: {
    request: z.object({ id: z.uuid() }),
    response: JobSchema,
  },

  cancel: {
    request: z.object({ id: z.uuid() }),
    response: JobSchema,
  },

  reclaimStale: {
    request: z.object({ stalledMinutes: z.number().int().min(1).default(60) }).optional(),
    response: z.object({ reclaimed: z.number().int().min(0) }),
  },

  group: {
    list: {
      request: BasePaginationQuerySchema,
      response: PaginationResultSchema(JobGroupSchema),
    },
    get: {
      request: BasePaginationQuerySchema.extend({
        id: z.uuid(),
        type: JobTypeEnum.optional().catch(undefined),
        status: JobStatusEnum.optional().catch(undefined),
      }),
      response: z.object({
        group: JobGroupSchema,
        jobs: PaginationResultSchema(JobSchema),
      }),
    },
    stats: {
      request: z.object({ groupId: z.uuid() }),
      response: z.object({
        total: z.number().int(),
        pending: z.number().int(),
        processing: z.number().int(),
        completed: z.number().int(),
        failed: z.number().int(),
        cancelled: z.number().int(),
        retrying: z.number().int(),
      }),
    },
    cancel: {
      request: z.object({ groupId: z.uuid() }),
      response: z.object({ cancelled: z.number().int().min(0) }),
    },
  },

  stats: {
    request: z.object({ types: JobTypeEnum.array().optional().catch(undefined) }).optional(),
    response: z.object({
      total: z.number().int(),
      pending: z.number().int(),
      processing: z.number().int(),
      completed: z.number().int(),
      failed: z.number().int(),
      cancelled: z.number().int(),
      retrying: z.number().int(),
      byType: z.record(JobTypeEnum, z.number()),
    }),
  },

  analytics: {
    request: z
      .object({
        days: z.number().int().min(1).max(90).optional().default(30),
        types: JobTypeEnum.array().optional().catch(undefined),
      })
      .optional(),
    response: z.object({
      jobsByDay: z.array(
        z.object({
          date: z.string(),
          pending: z.number().int(),
          processing: z.number().int(),
          completed: z.number().int(),
          failed: z.number().int(),
          cancelled: z.number().int(),
          retrying: z.number().int(),
        }),
      ),
      durationByType: z.array(
        z.object({
          type: JobTypeEnum,
          avgMs: z.number().int(),
          minMs: z.number().int(),
          maxMs: z.number().int(),
          count: z.number().int(),
        }),
      ),
      attemptDistribution: z.array(
        z.object({
          attempts: z.number().int(),
          count: z.number().int(),
        }),
      ),
      topErrors: z.array(
        z.object({
          error: z.string(),
          count: z.number().int(),
        }),
      ),
      statusCounts: z.record(JobStatusEnum, z.number().int()),
      typeCounts: z.record(JobTypeEnum, z.number().int()),
      groupSizes: z.array(
        z.object({
          groupId: z.string(),
          name: z.string(),
          count: z.number().int(),
        }),
      ),
    }),
  },
};
