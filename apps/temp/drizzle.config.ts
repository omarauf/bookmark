import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env";

export default defineConfig({
  schema: [
    "./src/modules/**/schema.ts",
    "./src/modules/**/schemas/**.ts",
    "./src/core/**/schema.ts",
  ],
  out: "./src/core/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL || "",
  },
  casing: "snake_case",
});
