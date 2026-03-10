import { z } from "zod";

export const TiktokMusicSchema = z.object({
  album: z.string().optional(),
  authorName: z.string().optional(),
  original: z.boolean(),
  duration: z.number().optional(),
  id: z.string(),
  title: z.string(),
  cover: z.string(),
  url: z.string().optional(),
});

export type TiktokMusic = z.infer<typeof TiktokMusicSchema>;
