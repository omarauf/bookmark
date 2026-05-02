import type z from "zod";
import type { JobSchemas } from "./contract";
import type {
  CreateJobGroupSchema,
  CreateJobLogSchema,
  CreateJobSchema,
  JobGroupSchema,
  JobLogSchema,
  JobSchema,
} from "./entity";
import type {
  DownloadMediaPayloadSchema,
  ImportProcessPayloadSchema,
  ImportUploadPayloadSchema,
} from "./payload";

export type Job = z.infer<typeof JobSchema>;
export type JobGroup = z.infer<typeof JobGroupSchema>;
export type JobLog = z.infer<typeof JobLogSchema>;

export type CreateJob = z.infer<typeof CreateJobSchema>;
export type CreateJobGroup = z.infer<typeof CreateJobGroupSchema>;
export type CreateJobLog = z.infer<typeof CreateJobLogSchema>;

export type DownloadMediaPayload = z.infer<typeof DownloadMediaPayloadSchema>;
export type ImportUploadPayload = z.infer<typeof ImportUploadPayloadSchema>;
export type ImportProcessPayload = z.infer<typeof ImportProcessPayloadSchema>;
export type JobPayload = Required<Job>["payload"];

export type ListJob = z.infer<typeof JobSchemas.list.request>;
