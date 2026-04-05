import type z from "zod";
import type { InstagramLocationSchema } from "./location";
import type { InstagramMusicSchema } from "./music";

export type InstagramLocation = z.infer<typeof InstagramLocationSchema>;
export type InstagramMusic = z.infer<typeof InstagramMusicSchema>;
