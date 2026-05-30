import type z from "zod";
import type { JobSchemas } from "./contract";
import type {
  CreateJobLogSchema,
  CreateJobSchema,
  JobLogSchema,
  JobSchema,
} from "./entity";
import type { JobPayloadSchemas } from "./payload";

export type Job = z.infer<typeof JobSchema>;
export type JobLog = z.infer<typeof JobLogSchema>;

export type CreateJob = z.infer<typeof CreateJobSchema>;
export type CreateJobLog = z.infer<typeof CreateJobLogSchema>;

export type DownloadMediaPayload = z.infer<typeof JobPayloadSchemas.downloadMedia>;
export type JobPayload = Required<Job>["payload"];

export type ListJob = z.infer<typeof JobSchemas.list.request>;
