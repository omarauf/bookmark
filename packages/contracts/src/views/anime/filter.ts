import { z } from "zod";

export const AnimeFilterSchema = z.object({
  q: z.string().optional().catch(undefined),
  genre: z.string().optional().catch(undefined),
  year: z.number().int().optional().catch(undefined),
  minRating: z.number().min(0).max(10).optional().catch(undefined),
  sortBy: z.enum(["rating", "year", "createdAt"]).optional().catch("createdAt"),
});
