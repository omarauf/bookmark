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
