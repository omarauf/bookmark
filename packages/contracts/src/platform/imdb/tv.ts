import z from "zod";

export const TvMetadataSchema = z.object({
  platform: z.literal("imdb"),
  kind: z.literal("tv"),
  plot: z.string(),
  directors: z.string().array(),
  writers: z.string().array(),
  actors: z.string().array(),
  year: z.number(),
  released: z.string(),
  genre: z.string().array(),
  poster: z.string(),
  rating: z.number(),
  votes: z.number(),
  seasons: z.number(),
  runtime: z.number(),
});

export type TvMetadata = z.infer<typeof TvMetadataSchema>;
