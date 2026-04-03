import type { LinkPreview } from "@workspace/contracts/link";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  // Equivalent to MongoDB's automatic _id
  id: uuid("id").defaultRandom().primaryKey(),

  title: text("title"),
  url: text("url").notNull(),
  folder: text("folder").notNull(),
  path: text("path").notNull(),

  // Storing the nested schema as a JSONB column and casting the type
  preview: jsonb("preview").$type<LinkPreview>(),

  deletedAt: timestamp("deleted_at", { mode: "date" }),

  // Equivalent to Mongoose's { timestamps: true }
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
