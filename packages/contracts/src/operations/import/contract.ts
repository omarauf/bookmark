import { z } from "zod";
import { CreateItemSchema } from "../../core/item/entity";
import { CreateRelationSchema } from "../../core/relation/entity";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
} from "../../foundation/pagination-query";
import { PlatformEnum } from "../../foundation/platform";
import { DownloadMediaPayloadSchema } from "../job/payload";
import { ImportSchema } from "./entity";

export const ImportPayloadSchema = z.object({
  items: CreateItemSchema.array(),
  invalidItems: z.any().array(),
  relations: CreateRelationSchema.array(),
  downloadTasks: DownloadMediaPayloadSchema.array(),
});

export const ImportSchemas = {
  list: {
    request: BasePaginationQuerySchema.extend({ platform: PlatformEnum.optional() }),
    response: PaginationResultSchema(ImportSchema),
  },

  create: {
    request: z.object({ file: z.file() }),
    response: z.object({ jobId: z.uuid().optional() }),
  },

  import: {
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

export type Import = z.infer<typeof ImportSchema>;
export type ImportPayload = z.infer<typeof ImportPayloadSchema>;
