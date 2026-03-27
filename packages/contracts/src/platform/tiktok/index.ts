import z from "zod";
import { BasePaginationQuerySchema } from "../../common/pagination-query";
import { CreateTiktokCreatorSchema } from "./creator";
import { TiktokMediaSchema } from "./media";
import { TiktokMusicSchema } from "./music";
import { CreateTiktokPostSchema } from "./post";

export const TiktokSchemas = {
  creator: CreateTiktokCreatorSchema,
  post: CreateTiktokPostSchema,
  music: TiktokMusicSchema,
  media: TiktokMediaSchema,

  list: {
    request: BasePaginationQuerySchema.extend({
      minDate: z.date().optional(),
      maxDate: z.date().optional(),
      username: z.string().optional(),
      collections: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
    }),
  },
};

export type CreateTiktokCreator = z.infer<typeof CreateTiktokCreatorSchema>;
export type CreateTiktokPost = z.infer<typeof CreateTiktokPostSchema>;
export type TiktokMedia = z.infer<typeof TiktokMediaSchema>;
export type TiktokMusic = z.infer<typeof TiktokMusicSchema>;
