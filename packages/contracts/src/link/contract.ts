import z from "zod";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
  SortingParamsSchema,
} from "../common/pagination-query";
import { LinkSchema } from "./entity";

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
    request: z.any(),
    response: z.void(),
  },

  create: {
    request: LinkSchema.omit({
      id: true,
      updatedAt: true,
      preview: true,
    }).array(),
    response: z.void(),
  },

  test: {
    request: z.any(),
    response: z.void(),
  },

  preview: {
    request: z.any(),
    response: z.void(),
  },

  favicon: {
    request: z.any(),
    response: z.void(),
  },

  move: {
    request: z.object({
      ids: z.string().array(),
      path: z.string(),
    }),
    response: z.void(),
  },

  delete: {
    request: z.object({
      ids: z.string().array(),
      hard: z.boolean().optional().default(false),
    }),
    response: z.void(),
  },
};

export type Link = z.infer<typeof LinkSchema>;
export type ListLink = z.infer<typeof LinkSchemas.list.request>;
export type LinkPreview = z.infer<typeof LinkSchema.shape.preview>;
export type CreateLink = z.infer<typeof LinkSchemas.create.request>;

export interface TreeNode {
  path: string;
  name: string;
  children?: TreeNode[];
}
