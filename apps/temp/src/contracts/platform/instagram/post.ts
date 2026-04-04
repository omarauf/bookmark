import z from "zod";
import { CreateBaseItemSchema } from "../base/item";
import { InstagramPostTypeEnum } from "./enum";
import { InstagramLocationSchema } from "./location";
import { InstagramMusicSchema } from "./music";

export const InstagramMetadataPostSchema = z.object({
  type: InstagramPostTypeEnum,
  code: z.string(),
  location: InstagramLocationSchema.optional(),
  music: InstagramMusicSchema.optional(),
  likes: z.number(),
  play: z.number().optional(),
  view: z.number().optional(),
});

export const CreateInstagramPostSchema = CreateBaseItemSchema.extend({
  platform: z.literal("instagram"),
  kind: z.literal("post"),
  metadata: InstagramMetadataPostSchema,
});
