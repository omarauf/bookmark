import { z } from "zod";

export const ImdbFilterSchema = z.object({
  q: z.string().optional().catch(undefined),
  kind: z.enum(["movie", "tv"]).optional().catch(undefined),
  genre: z.string().optional().catch(undefined),
  year: z.number().int().optional().catch(undefined),
  minRating: z.number().min(0).max(10).optional().catch(undefined),
  sortBy: z.enum(["rating", "year", "createdAt"]).optional().catch("createdAt"),
});

export type ImdbFilter = z.infer<typeof ImdbFilterSchema>;
