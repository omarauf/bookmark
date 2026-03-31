import z from "zod";
import { CollectionSchema } from "../../collection/entity";
import { BasePaginationQuerySchema } from "../../common/pagination-query";
import { CreateInstagramCreatorSchema } from "./creator";
import { InstagramTaggedCreatorSchema } from "./creator-tag";
import { InstagramLocationSchema } from "./location";
import { InstagramMediaSchema } from "./media";
import { InstagramMusicSchema } from "./music";
import { CreateInstagramPostSchema } from "./post";

export const InstagramSchemas = {
  creator: CreateInstagramCreatorSchema,
  creatorTag: InstagramTaggedCreatorSchema,
  post: CreateInstagramPostSchema,
  location: InstagramLocationSchema,
  music: InstagramMusicSchema,
  media: InstagramMediaSchema,

  list: {
    request: BasePaginationQuerySchema.extend({
      minDate: z.date().optional(),
      maxDate: z.date().optional(),
      username: z.string().optional(),
      collection: CollectionSchema.optional(),
      tags: z.array(z.string()).optional(),
      mediaType: z.enum(["image", "video", "carousel"]).optional(),
    }),
  },
};

export type InstagramPost = z.infer<typeof InstagramSchemas.post>;
export type CreateInstagramCreator = z.infer<typeof CreateInstagramCreatorSchema>;
export type CreateInstagramPost = z.infer<typeof CreateInstagramPostSchema>;
export type InstagramLocation = z.infer<typeof InstagramLocationSchema>;
export type InstagramMedia = z.infer<typeof InstagramMediaSchema>;
export type InstagramMusic = z.infer<typeof InstagramMusicSchema>;
export type InstagramCreatorTag = z.infer<typeof InstagramTaggedCreatorSchema>;
