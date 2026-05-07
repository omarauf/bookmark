import { z } from "zod";

export const YoutubeMetadataSchema = z.object({
  platform: z.literal("youtube"),
  kind: z.literal("video"),
  thumbnail: z.string(),
  publishedAt: z.date(),
  description: z.string().optional(),
  channelId: z.string(),
  channelTitle: z.string(),
  tags: z.string().array(),
  categoryId: z.string(),
  duration: z.number(),
  views: z.number(),
  likes: z.number(),
  comments: z.number(),
});

export type YoutubeMetadata = z.infer<typeof YoutubeMetadataSchema>;
