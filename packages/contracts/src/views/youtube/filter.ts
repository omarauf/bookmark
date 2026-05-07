import { z } from "zod";

export const YoutubeFilterSchema = z.object({
  q: z.string().optional().catch(undefined),
});
