import { z } from "zod";

const envSchema = z.object({
  CORS_ORIGIN: z.string().transform((v) => {
    if (v.includes(",")) return v.split(",").map((s) => s.trim());
    return [v.trim()];
  }),
  DATABASE_URL: z.string(),
  DOMAIN: z.string().default("localhost"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  REDIS_HOST: z.string().default("127.0.0.1"),
  REDIS_PORT: z.coerce.number().min(1).default(6379),
  SUPER_ADMIN_EMAIL: z.email().min(1, "SUPER_ADMIN_EMAIL is required"),
  SUPER_ADMIN_PASSWORD: z.string().min(8, "SUPER_ADMIN_PASSWORD must be at least 8 characters"),
  S3_REGION: z.string().min(1, "S3_REGION is required"),
  S3_ENDPOINT: z.string().min(1, "S3_ENDPOINT is required"),
  S3_ACCESS_KEY: z.string().min(1, "S3_ACCESS_KEY is required"),
  S3_SECRET_KEY: z.string().min(1, "S3_SECRET_KEY is required"),
  S3_BUCKET_NAME: z.string().min(1, "S3_BUCKET_NAME is required"),
});

export const env = envSchema.parse(process.env);
