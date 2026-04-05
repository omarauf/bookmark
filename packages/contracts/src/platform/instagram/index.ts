import z from "zod";
import { CollectionSchema } from "../../collection/entity";
import { BasePaginationQuerySchema } from "../../common/pagination-query";
import { InstagramLocationSchema } from "./location";
import { InstagramMusicSchema } from "./music";

export const InstagramSchemas = {
  // creator: CreateInstagramCreatorSchema,
  // post: CreateInstagramPostSchema,
  location: InstagramLocationSchema,
  music: InstagramMusicSchema,

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

// export type InstagramPost = z.infer<typeof InstagramSchemas.post>;
// export type CreateInstagramCreator = z.infer<typeof CreateInstagramCreatorSchema>;
// export type CreateInstagramPost = z.infer<typeof CreateInstagramPostSchema>;
export type InstagramLocation = z.infer<typeof InstagramLocationSchema>;
export type InstagramMusic = z.infer<typeof InstagramMusicSchema>;
