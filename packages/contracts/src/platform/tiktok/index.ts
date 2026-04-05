import z from "zod";
import { CollectionSchema } from "../../collection/entity";
import { BasePaginationQuerySchema } from "../../common/pagination-query";
// import { CreateTiktokCreatorSchema } from "./creator";
import { TiktokMusicSchema } from "./music";
// import { CreateTiktokPostSchema } from "./post";

export const TiktokSchemas = {
  // creator: CreateTiktokCreatorSchema,
  // post: CreateTiktokPostSchema,
  music: TiktokMusicSchema,

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

// export type CreateTiktokCreator = z.infer<typeof CreateTiktokCreatorSchema>;
// export type CreateTiktokPost = z.infer<typeof CreateTiktokPostSchema>;
export type TiktokMusic = z.infer<typeof TiktokMusicSchema>;
