import z from "zod";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
  SortingParamsSchema,
} from "../common/pagination-query";
import type { PreviewSchema } from "../platform/chrome";
import { LinkSchema, PathTree } from "./entity";

export const LinkSchemas = {
  tree: {
    request: SortingParamsSchema.extend({
      path: z.string().default("/").catch("/"),
      // q: z.string().optional(),
    }),
    response: z.object({
      folders: z.object({ path: z.string(), folder: z.string() }).array(),
      links: LinkSchema.array(),
    }),
  },

  list: {
    request: BasePaginationQuerySchema.extend({
      path: z.string().default("/").catch("/"),
      q: z.string().optional(),
      domain: z.string().optional(),
    }),
    response: PaginationResultSchema(LinkSchema),
  },

  domains: {
    request: z.any(),
    response: z.object({ domain: z.string(), count: z.number() }).array(),
  },

  folders: {
    response: PathTree.array(),
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
export type PathNode = z.infer<typeof PathTree>;
