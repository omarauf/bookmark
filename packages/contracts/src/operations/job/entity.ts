import { z } from "zod";
import { JobStatusEnum, JobTypeEnum, LogLevelEnum } from "./enum";
import {
  DownloadMediaPayloadSchema,
  ImdbDiscoverPayloadSchema,
  ImdbFetchPayloadSchema,
  ImportProcessPayloadSchema,
  ImportUploadPayloadSchema,
} from "./payload";

export const JobGroupSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const JobSchema = z.object({
  id: z.uuid(),
  groupId: z.uuid().optional(),

  type: JobTypeEnum,
  status: JobStatusEnum,

  resourceType: z.string().optional(),
  resourceId: z.string().optional(),

  payload: z
    .union([
      DownloadMediaPayloadSchema,
      ImportUploadPayloadSchema,
      ImportProcessPayloadSchema,
      ImdbDiscoverPayloadSchema,
      ImdbFetchPayloadSchema,
    ])
    .optional(),

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

export const CreateJobGroupSchema = z.object({
  name: z.string(),
});

export const CreateJobSchema = z.object({
  type: JobTypeEnum,
  status: z.literal("pending").optional().default("pending"),

  resourceType: z.string().optional(),
  resourceId: z.string().optional(),

  payload: z
    .union([
      DownloadMediaPayloadSchema,
      ImportUploadPayloadSchema,
      ImportProcessPayloadSchema,
      ImdbDiscoverPayloadSchema,
      ImdbFetchPayloadSchema,
    ])
    .optional(),

  progress: z.number().int().min(0).max(100).optional(),

  maxAttempts: z.number().int().min(1).optional(),
});

export const CreateJobLogSchema = JobLogSchema.omit({
  id: true,
  createdAt: true,
});
