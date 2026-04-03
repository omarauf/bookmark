import type z from "zod";
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
};

export type InstagramPost = z.infer<typeof InstagramSchemas.post>;
export type CreateInstagramCreator = z.infer<typeof CreateInstagramCreatorSchema>;
export type CreateInstagramPost = z.infer<typeof CreateInstagramPostSchema>;
export type InstagramLocation = z.infer<typeof InstagramLocationSchema>;
export type InstagramMedia = z.infer<typeof InstagramMediaSchema>;
export type InstagramMusic = z.infer<typeof InstagramMusicSchema>;
export type InstagramCreatorTag = z.infer<typeof InstagramTaggedCreatorSchema>;
