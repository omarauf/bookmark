import type z from "zod";
import type { TiktokMusicSchema } from "./music";

export type TiktokMusic = z.infer<typeof TiktokMusicSchema>;
