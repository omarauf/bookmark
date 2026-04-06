import z from "zod";
import { BasePaginationQuerySchema, PaginationResultSchema } from "../common/pagination-query";
import { PlatformEnum } from "../common/platform";
import { ImportSchema } from "./entity";

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
