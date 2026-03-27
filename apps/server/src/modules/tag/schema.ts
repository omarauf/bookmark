import { pgTable, text } from "drizzle-orm/pg-core";
import { baseTable } from "@/core/db/helper/entity";

export const tags = pgTable("tags", {
  ...baseTable,

  name: text().notNull(),
  color: text().notNull(),
});
