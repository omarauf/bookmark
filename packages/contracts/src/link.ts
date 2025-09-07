import z from "zod";
import { ObjectIdSchema } from "./common/object-id-schema";
import { BasePaginationQuerySchema, SortingParamsSchema } from "./common/pagination-query";

const PreviewSchema = z.object({
  url: z.string(),
  mediaType: z.string(),
  favicons: z.array(z.string()),
  title: z.string().optional(),
  charset: z.string().optional(),
  siteName: z.string().optional(),
  description: z.string().optional(),
  contentType: z.string().optional(),
  images: z.array(z.string()).optional(),
  videos: z
    .array(
      z.object({
        url: z.string().optional(),
        secureUrl: z.string().nullable().optional(),
        type: z.string().nullable().optional(),
        width: z.string().optional(),
        height: z.string().optional(),
      }),
    )
    .optional(),
});

const LinkEntitySchema = z.object({
  _id: ObjectIdSchema,
  id: z.string(),
  title: z.string().optional(),
  url: z.url(),
  folder: z.string(),
  path: z.string(),
  preview: PreviewSchema.optional(),
  deletedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const LinkSchema = LinkEntitySchema.extend({ _id: z.string() });

export const CreateLinkSchema = LinkEntitySchema.omit({
  _id: true,
  id: true,
  updatedAt: true,
  preview: true,
}).partial({
  createdAt: true,
});

export const MoveLinkSchema = z.object({
  ids: z.string().array(),
  path: z.string(),
});

export const DeleteLinkSchema = z.object({
  ids: z.string().array(),
  hard: z.boolean().optional().default(false),
});

export const TreeLinkSchema = SortingParamsSchema.extend({
  path: z.string().default("/").catch("/"),
  // q: z.string().optional(),
});

export const ListLinkSchema = BasePaginationQuerySchema.extend({
  q: z.string().optional(),
  domain: z.string().optional(),
});

export type LinkEntity = z.infer<typeof LinkEntitySchema>;
export type Link = z.infer<typeof LinkSchema>;
export type LinkPreview = z.infer<typeof PreviewSchema>;
export type CreateLink = z.infer<typeof CreateLinkSchema>;
export type MoveLink = z.infer<typeof MoveLinkSchema>;
export type TreeLink = z.infer<typeof TreeLinkSchema>;
export type ListLink = z.infer<typeof ListLinkSchema>;

export interface TreeNode {
  path: string;
  name: string;
  children?: TreeNode[];
}
