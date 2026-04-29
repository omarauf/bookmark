import { z } from "zod";

export const TwitterMetadataPostSchema = z.object({
  platform: z.literal("twitter"),
  kind: z.literal("post"),
  imageDescription: z.string().optional(),
  videoDescription: z.string().optional(),
  views: z.number(),
  likes: z.number(),
  quotes: z.number(),
  replies: z.number(),
  retweets: z.number(),
  bookmarks: z.number(),
});
