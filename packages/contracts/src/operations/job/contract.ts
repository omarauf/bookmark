import { z } from "zod";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
} from "../../foundation/pagination-query";
import { JobLogSchema, JobSchema } from "./entity";
import { JobStatusEnum, JobTypeEnum, LogLevelEnum } from "./enum";

export const JobSchemas = {
  list: {
    request: BasePaginationQuerySchema.extend({
      type: JobTypeEnum.optional().catch(undefined),
      status: JobStatusEnum.optional().catch(undefined),
      resourceType: z.string().optional().catch(undefined),
      resourceId: z.string().optional().catch(undefined),
    }),
    response: PaginationResultSchema(JobSchema),
  },

  get: {
    request: z.object({ id: z.uuid() }),
    response: JobSchema,
  },

  logs: {
    request: BasePaginationQuerySchema.extend({
      jobId: z.uuid(),
      level: LogLevelEnum.optional().catch(undefined),
    }),
    response: PaginationResultSchema(JobLogSchema),
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

  stats: {
    request: z.object({ type: JobTypeEnum.optional().catch(undefined) }).optional(),
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
};
