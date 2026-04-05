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
};

export type Post = z.infer<typeof PostSchema>;
export type PostMetadata = Post["metadata"];
export type ListPost = z.infer<typeof PostSchemas.list.request>;
