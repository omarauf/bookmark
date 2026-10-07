import { z } from "zod";
import { CreateItemSchema } from "../../core/item/entity";
import { CreateRelationSchema } from "../../core/relation/entity";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
} from "../../foundation/pagination-query";
import { PlatformEnum } from "../../foundation/platform";
import { JobPayloadSchemas } from "../job/payload";
import { ScrapeSchema } from "./entity";

export const ScrapePayloadSchema = z.object({
  items: CreateItemSchema.array(),
  invalidItems: z.any().array(),
  relations: CreateRelationSchema.array(),
  downloadTasks: JobPayloadSchemas.downloadMedia.array(),
});

export const ScrapeSchemas = {
  list: {
    request: BasePaginationQuerySchema.extend({ platform: PlatformEnum.optional() }),
    response: PaginationResultSchema(ScrapeSchema),
  },

  create: {
    request: z.object({ file: z.file() }),
    response: z.object({ jobId: z.uuid().optional() }),
  },

  process: {
    request: z.object({ id: z.uuid() }),
    response: z.object({ jobId: z.uuid() }),
  },

  get: {
    request: z.object({ id: z.uuid() }),
    response: ScrapeSchema,
  },

  content: {
    request: z.object({ id: z.uuid() }),
    response: z.object({ content: z.string() }),
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

export type Scrape = z.infer<typeof ScrapeSchema>;
export type ScrapePayload = z.infer<typeof ScrapePayloadSchema>;
