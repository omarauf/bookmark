import { z } from "zod";

export const JobTypeEnum = z.enum([
  "import_upload",
  "import_process",
  "download_media",
  "imdb_discover",
  "imdb_fetch",
]);
export type JobType = z.infer<typeof JobTypeEnum>;
export const JobTypeValues = JobTypeEnum.options as [JobType, ...JobType[]];

export const JobStatusEnum = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
  "retrying",
]);
export type JobStatus = z.infer<typeof JobStatusEnum>;
export const JobStatusValues = JobStatusEnum.options as [JobStatus, ...JobStatus[]];

export const LogLevelEnum = z.enum(["debug", "info", "warn", "error"]);
export type LogLevel = z.infer<typeof LogLevelEnum>;
export const LogLevelValues = LogLevelEnum.options as [LogLevel, ...LogLevel[]];
