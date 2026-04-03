import z from "zod";
import { CreateBasePostSchema } from "../base/post";
import { CreateInstagramCreatorSchema } from "./creator";
import { InstagramTaggedCreatorSchema } from "./creator-tag";
import { InstagramPostTypeEnum } from "./enum";
import { InstagramLocationSchema } from "./location";
import { InstagramMediaSchema } from "./media";
import { InstagramMusicSchema } from "./music";

export const CreateInstagramPostSchema = CreateBasePostSchema.extend({
  media: InstagramMediaSchema.array(),
  taggedCreators: InstagramTaggedCreatorSchema.array(),
  creator: CreateInstagramCreatorSchema,
  location: InstagramLocationSchema.optional(),
  type: InstagramPostTypeEnum,
  likes: z.number(),
  play: z.number().optional(),
  view: z.number().optional(),
  music: InstagramMusicSchema.optional(),
  platform: z.literal("instagram"),
  code: z.string(),
});

export const InstagramMetadataPostSchema = z.object({
  platform: z.literal("instagram"),
  type: InstagramPostTypeEnum,
  code: z.string(),
  location: InstagramLocationSchema.optional(),
  music: InstagramMusicSchema.optional(),
  likes: z.number(),
  play: z.number().optional(),
  view: z.number().optional(),
});
