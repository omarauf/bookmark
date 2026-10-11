import { z } from "zod";
import { InstagramPostTypeEnum } from "./enum";
import { InstagramLocationSchema } from "./location";
import { InstagramMusicSchema } from "./music";

export const InstagramMetadataPostSchema = z.object({
  platform: z.literal("instagram"),
  kind: z.literal("post"),
  type: InstagramPostTypeEnum,
  code: z.string(),
  location: InstagramLocationSchema.optional(),
  music: InstagramMusicSchema.optional(),
  likes: z.number(),
  comments: z.number().optional(),
  plays: z.number().optional(),
  views: z.number().optional(),
});
