import z from "zod";
import { InstagramPostTypeEnum } from "./enum";
import { InstagramLocationSchema } from "./location";
import { InstagramMusicSchema } from "./music";

// const InstagramMetadataPostSchema = z.object({
//   type: InstagramPostTypeEnum,
//   code: z.string(),
//   location: InstagramLocationSchema.optional(),
//   music: InstagramMusicSchema.optional(),
//   likes: z.number(),
//   play: z.number().optional(),
//   view: z.number().optional(),
// });

// export const CreateInstagramPostSchema = z.object({
//   platform: z.literal("instagram"),
//   kind: z.literal("post"),
//   metadata: InstagramMetadataPostSchema,
// });

export const InstagramMetadataPostSchema = z.object({
  platform: z.literal("instagram"),
  kind: z.literal("post"),
  type: InstagramPostTypeEnum,
  code: z.string(),
  location: InstagramLocationSchema.optional(),
  music: InstagramMusicSchema.optional(),
  likes: z.number(),
  play: z.number().optional(),
  view: z.number().optional(),
});
