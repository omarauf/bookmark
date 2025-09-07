import { z } from "zod";

// Music Schemas
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

export type InstagramMusic = z.infer<typeof InstagramMusicSchema>;
