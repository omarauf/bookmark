import { z } from "zod";

const envSchema = z.object({
  CORS_ORIGIN: z.string(),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  REDIS_HOST: z.string().default("127.0.0.1"),
  REDIS_PORT: z.coerce.number().min(1).default(6379),
});

export const env = envSchema.parse(process.env);
