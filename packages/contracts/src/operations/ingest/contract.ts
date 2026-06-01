import { z } from "zod";
import { CreateItemSchema } from "../../core/item/entity";
import { CreateRelationSchema } from "../../core/relation/entity";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
} from "../../foundation/pagination-query";
import { PlatformEnum } from "../../foundation/platform";
import { JobSchema } from "../job/entity";
import { JobPayloadSchemas } from "../job/payload";
import { IngestSchema } from "./entity";

export const IngestPayloadSchema = z.object({
  items: CreateItemSchema.array(),
  invalidItems: z.any().array(),
  relations: CreateRelationSchema.array(),
  downloadTasks: JobPayloadSchemas.downloadMedia.array(),
});

export const IngestSchemas = {
  list: {
    request: BasePaginationQuerySchema.extend({ platform: PlatformEnum.optional() }),
    response: PaginationResultSchema(IngestSchema),
  },

  create: {
    request: z.object({ file: z.file() }),
    response: z.object({ jobId: z.uuid().optional() }),
  },

  ingest: {
    request: z.object({ id: z.uuid() }),
    response: z.object({ jobId: z.uuid() }),
  },

  get: {
    request: z.object({ id: z.uuid() }),
    response: IngestSchema,
  },

  jobs: {
    request: BasePaginationQuerySchema.extend({ id: z.uuid() }),
    response: PaginationResultSchema(JobSchema),
  },

  delete: {
    request: z.object({ id: z.uuid() }),
    response: z.void(),
  },

  download: {
    request: z.object({ id: z.uuid() }),
    response: z.void(),
  },

  stats: {
    request: z.object({ id: z.uuid() }),
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
    request: z.object({ id: z.uuid() }),
    response: z.object({ cancelled: z.number().int().min(0) }),
  },
};

export type Ingest = z.infer<typeof IngestSchema>;
export type IngestPayload = z.infer<typeof IngestPayloadSchema>;
