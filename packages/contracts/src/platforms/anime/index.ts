import { z } from "zod";

export const AnimeMetadataSchema = z.object({
  platform: z.literal("mal"),
  kind: z.literal("anime"),
  synopsis: z.string(),
  poster: z.string(),
  rating: z.number().optional(),
  rank: z.number().optional(),
  popularity: z.number().optional(),
  numEpisodes: z.number().optional(),
  genres: z.string().array(),
  studios: z.string().array(),
  source: z.string().optional(),
  status: z.string().optional(),
  mediaType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  startSeasonYear: z.number().optional(),
  startSeason: z.string().optional(),
  broadcastDay: z.string().optional(),
  broadcastTime: z.string().optional(),
  averageEpisodeDuration: z.number().optional(),
  ratingLabel: z.string().optional(),
  numListUsers: z.number().optional(),
  numScoringUsers: z.number().optional(),
  nsfw: z.string().optional(),
  background: z.string().optional(),
});

export type AnimeMetadata = z.infer<typeof AnimeMetadataSchema>;
