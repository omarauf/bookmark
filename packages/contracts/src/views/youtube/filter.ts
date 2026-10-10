import { z } from "zod";

export const YoutubeFilterSchema = z.object({
  q: z.string().optional().catch(undefined),
  downloadStatus: z.enum(["downloaded", "not_downloaded"]).optional().catch(undefined),
  sortBy: z.enum(["createdAt", "publishedAt", "views", "duration"]).optional().catch(undefined),
});
