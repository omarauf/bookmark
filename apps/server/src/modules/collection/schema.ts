import { pgTable, text } from "drizzle-orm/pg-core";
import { baseTable } from "@/core/db/helper/entity";

export const collections = pgTable("collections", {
  ...baseTable,

  name: text().notNull(),
  color: text().notNull(),
});
