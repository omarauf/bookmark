import { z } from "zod";
import { JobStatusEnum, JobTypeEnum, LogLevelEnum } from "./enum";
import { JobPayloadSchema } from "./payload";

export const JobSchema = z.object({
  id: z.uuid(),
  ingestId: z.uuid().optional(),

  type: JobTypeEnum,
  status: JobStatusEnum,

  resourceType: z.string().optional(),
  resourceId: z.string().optional(),

  payload: JobPayloadSchema.optional(),

  progress: z.number().int().min(0).max(100).optional(),

  attemptCount: z.number().int().min(0).default(0),
  maxAttempts: z.number().int().min(1).default(3),
  retryAt: z.date().optional(),

  error: z.string().optional(),
  errorDetail: z.string().optional(),

  createdAt: z.date(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  failedAt: z.date().optional(),
  cancelledAt: z.date().optional(),
});

export const JobLogSchema = z.object({
  id: z.uuid(),
  jobId: z.uuid(),
  level: LogLevelEnum,
  message: z.string(),
  metadata: z.unknown().optional(),
  createdAt: z.date(),
});

// -----------------------------------------------------------------------------

export const CreateJobSchema = z.object({
  type: JobTypeEnum,
  status: z.literal("pending").optional().default("pending"),

  ingestId: z.uuid().optional(),

  resourceType: z.string().optional(),
  resourceId: z.string().optional(),

  payload: JobPayloadSchema.optional(),

  progress: z.number().int().min(0).max(100).optional(),

  maxAttempts: z.number().int().min(1).optional(),
});

export const CreateJobLogSchema = JobLogSchema.omit({
  id: true,
  createdAt: true,
});
