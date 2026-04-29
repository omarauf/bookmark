import z from "zod";

export const MovieMetadataSchema = z.object({
  platform: z.literal("imdb"),
  kind: z.literal("movie"),
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
  boxOffice: z.number(),
  runtime: z.number(),
  rated: z.string(),
});

export type MovieMetadata = z.infer<typeof MovieMetadataSchema>;
