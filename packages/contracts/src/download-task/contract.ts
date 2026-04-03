import z from "zod";
import { BasePaginationQuerySchema, PaginationResultSchema } from "../common/pagination-query";
import { PlatformEnum } from "../common/platform";
import { ReferenceTypeEnum } from "../media/enum";
import { DownloadTaskSchema } from "./entity";
import { DownloadStatusEnum } from "./enum";

export const DownloadTaskSchemas = {
  list: {
    request: BasePaginationQuerySchema.extend({
      status: DownloadStatusEnum.optional().catch(undefined),
      platform: PlatformEnum.optional().catch(undefined),
    }),
    response: PaginationResultSchema(DownloadTaskSchema),
  },
  stats: {
    request: z.void(),
    response: z.object({
      total: z.number(),
      pending: z.number(),
      processing: z.number(),
      completed: z.number(),
      failed: z.number(),
      exists: z.number(),
      byPlatform: z.record(PlatformEnum, z.number()),
      byReferenceType: z.record(ReferenceTypeEnum, z.number()),
    }),
  },
};
