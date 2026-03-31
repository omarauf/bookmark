import z from "zod";
import { CollectionSchema } from "../../collection/entity";
import { BasePaginationQuerySchema } from "../../common/pagination-query";
import { CreateTwitterCreatorSchema } from "./creator";
import { TwitterMediaSchema } from "./media";
import { CreateTwitterPostSchema } from "./post";

export const TwitterSchemas = {
  creator: CreateTwitterCreatorSchema,
  post: CreateTwitterPostSchema,
  media: TwitterMediaSchema,

  list: {
    request: BasePaginationQuerySchema.extend({
      minDate: z.date().optional(),
      maxDate: z.date().optional(),
      username: z.string().optional(),
      collection: CollectionSchema.optional(),
      tags: z.array(z.string()).optional(),
    }),
  },
};

export type CreateTwitterCreator = z.infer<typeof CreateTwitterCreatorSchema>;
export type CreateTwitterPost = z.infer<typeof CreateTwitterPostSchema>;
export type TwitterMedia = z.infer<typeof TwitterMediaSchema>;
