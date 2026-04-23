import z from "zod";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
  SortingParamsSchema,
} from "../common/pagination-query";
import type { PreviewSchema } from "../platform/chrome";
import { FolderTreeSchema, LinkSchema } from "./entity";

export const LinkSchemas = {
  tree: {
    request: SortingParamsSchema.extend({
      path: z.string().optional().catch(undefined),
      q: z.string().optional().catch(undefined),
      domain: z.string().optional().catch(undefined),
    }),
    response: z.object({
      folders: z.object({ path: z.string(), name: z.string() }).array(),
      links: LinkSchema.array(),
    }),
  },

  list: {
    request: BasePaginationQuerySchema.extend({
      path: z.string().optional().catch(undefined),
      q: z.string().optional(),
      domain: z.string().optional(),
    }),
    response: PaginationResultSchema(LinkSchema),
  },

  domains: {
    request: z.any(),
    response: z.object({ domain: z.string(), count: z.number() }).array(),
  },

  folderTree: {
    response: FolderTreeSchema.array(),
  },

  folderList: {
    response: z.object({ path: z.string(), name: z.string() }).array(),
  },

  move: {
    request: z.object({ ids: z.uuidv7().array(), path: z.string() }),
    response: z.void(),
  },

  delete: {
    request: z.object({
      ids: z.uuidv7().array(),
      hard: z.boolean().optional().default(false),
    }),
    response: z.void(),
  },

  fetchPreviews: {
    request: z.object({
      batchSize: z.number().int().min(1).max(500).optional().default(50),
    }),
    response: z.void(),
  },
};

export type Link = z.infer<typeof LinkSchema>;
export type ListLink = z.infer<typeof LinkSchemas.list.request>;
export type LinkPreview = z.infer<typeof PreviewSchema>;
export type FolderTree = z.infer<typeof FolderTreeSchema>;
export type FolderList = z.infer<typeof LinkSchemas.folderList.response>;
