import z from "zod";
import { BasePaginationQuerySchema, PaginationResultSchema } from "../common/pagination-query";
import type { CreateBasePostSchema } from "../platform/base/post";
import { CreatePostSchema, PostSchema } from "./entity";
import { PostFilterSchema } from "./filter";

export const PostSchemas = {
  create: CreatePostSchema,
  filter: PostFilterSchema,

  list: {
    request: BasePaginationQuerySchema.extend({
      ...PostFilterSchema.shape,
    }),
    response: PaginationResultSchema(PostSchema),
  },

  get: {
    request: z.object({ id: z.uuid() }),
    response: z.object({
      ...PostSchema.shape,
      get quotedPost() {
        return PostSchema.nullish();
      },
    }),
  },

  update: {
    request: z.object({
      id: z.uuid(),
      note: z.string().optional(),
      rate: z.number().optional(),
      tagIds: z.uuid().array(),
      collectionIds: z.uuid().array(),
      favorite: z.boolean().optional(),
    }),
    response: z.void(),
  },

  delete: {
    request: z.object({ id: z.string(), hard: z.boolean().default(false) }),
    response: z.void(),
  },

  deleteAll: {
    request: z.object({ hard: z.boolean().default(false) }),
    response: z.void(),
  },
};

export type Post = z.infer<typeof PostSchema>;
export type PostMetadata = Post["metadata"];
export type CreatePost = z.infer<typeof CreatePostSchema>;
export type CreateBasePost = z.infer<typeof CreateBasePostSchema>;

export type UpdatePost = z.infer<typeof PostSchemas.update.request>;

// type InstagramMetadata = Extract<PostMetadata, { platform: "instagram" }>;
// export type InstagramPost = Omit<Post, "metadata"> & { metadata: InstagramMetadata };
