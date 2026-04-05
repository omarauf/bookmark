import { z } from "zod";

const InstagramMusicOriginalSchema = z.object({
  original: z.literal(true),
});

const InstagramMusicNonOriginalSchema = z.object({
  original: z.literal(false),
  artist: z.string(),
  title: z.string(),
});

export const InstagramMusicSchema = z.union([
  InstagramMusicOriginalSchema,
  InstagramMusicNonOriginalSchema,
]);

export const TiktokMusicSchema = z.object({
  album: z.string().optional(),
  authorName: z.string().optional(),
  original: z.boolean(),
  duration: z.number().optional(),
  id: z.string(),
  title: z.string(),
  // cover: z.string(),
  // url: z.string().optional(),
});
