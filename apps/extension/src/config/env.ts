import { z } from "zod";

const envSchema = z.object({
  VITE_SERVER_URL: z.url(),
  VITE_INSTAGRAM_USERNAME: z.string().min(1),
  VITE_TWITTER_USERNAME: z.string().min(1),
});

export const env = envSchema.parse(import.meta.env);
