import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/config/env";
import * as schema from "./schemas";

export const db = drizzle({
  connection: env.DATABASE_URL,
  schema,
  casing: "snake_case",
  logger: false,
});
