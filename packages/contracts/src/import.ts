import z from "zod";
import { BasePaginationQuerySchema, PaginationResultSchema } from "./common/pagination-query";
import { PlatformEnum } from "./common/platform";

const ImportSchema = z.object({
  id: z.uuid(),
  filename: z.string(),
  platform: PlatformEnum,
  size: z.number(),
  validPost: z.number(),
  invalidPost: z.number(),

  importedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  scrapedAt: z.date(),
});

export const ImportSchemas = {
  list: {
    request: BasePaginationQuerySchema.extend({ platform: PlatformEnum.optional() }),
    response: PaginationResultSchema(ImportSchema),
  },

  create: {
    request: z.object({ file: z.file() }),
    response: z.void(),
  },

  import: {
    request: z.object({ id: z.uuid() }),
    response: z.object({ valid: z.number() }),
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
