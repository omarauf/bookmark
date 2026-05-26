import { z } from "zod";
import { CreateItemSchema } from "../../core/item/entity";
import { CreateRelationSchema } from "../../core/relation/entity";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
} from "../../foundation/pagination-query";
import { PlatformEnum } from "../../foundation/platform";
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

  delete: {
    request: z.object({ id: z.uuid() }),
    response: z.void(),
  },

  download: {
    request: z.object({ id: z.uuid() }),
    response: z.void(),
  },
};

export type Ingest = z.infer<typeof IngestSchema>;
export type IngestPayload = z.infer<typeof IngestPayloadSchema>;
