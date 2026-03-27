import { PlatformValues } from "@workspace/contracts/platform";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { IdentifiedEntityModel } from "@/core/db/helper/entity";

export const imports = pgTable("imports", {
  ...IdentifiedEntityModel,

  filename: text().notNull(),
  platform: text({ enum: PlatformValues }).notNull(),
  size: integer().notNull(),
  validPost: integer().notNull(),
  invalidPost: integer().notNull(),

  deletedAt: timestamp(),
  scrapedAt: timestamp().notNull(),
  importedAt: timestamp(),
});
