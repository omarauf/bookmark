import z from "zod";
import { TiktokMusicSchema } from "./music";

// const TiktokMetadataPostSchema = z.object({
//   music: TiktokMusicSchema.optional(),
//   likes: z.number(),
//   comments: z.number(),
//   shares: z.number(),
//   plays: z.number(),
//   collects: z.number(),
// });

// export const CreateTiktokPostSchema = z.object({
//   platform: z.literal("tiktok"),
//   kind: z.literal("post"),
//   metadata: TiktokMetadataPostSchema,
// });

export const TiktokMetadataPostSchema = z.object({
  platform: z.literal("tiktok"),
  kind: z.literal("post"),
  music: TiktokMusicSchema.optional(),
  likes: z.number(),
  comments: z.number(),
  shares: z.number(),
  plays: z.number(),
  collects: z.number(),
});
