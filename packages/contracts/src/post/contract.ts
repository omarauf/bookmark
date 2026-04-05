import z from "zod";
import { BasePaginationQuerySchema, PaginationResultSchema } from "../common/pagination-query";
import { PostSchema } from "./entity";
import { PostFilterSchema } from "./filter";

export const PostSchemas = {
  filter: PostFilterSchema,

  list: {
    request: BasePaginationQuerySchema.extend({
      ...PostFilterSchema.shape,
    }),
    response: PaginationResultSchema(PostSchema),
  },

  get: {
    request: z.object({ id: z.uuid() }),
    response: PostSchema,
  },

  update: {
    request: z.object({
      id: z.uuid(),
      note: z.string().optional(),
      rate: z.number().optional(),
      tagIds: z.uuid().array(),
      collectionId: z.uuid().optional(),
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
export type ListPost = z.infer<typeof PostSchemas.list.request>;
export type UpdatePost = z.infer<typeof PostSchemas.update.request>;
