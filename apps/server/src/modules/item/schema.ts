import type { ItemMetadata } from "@workspace/contracts/item";
import { KindValues, PlatformValues } from "@workspace/contracts/platform";
import { boolean, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations as drizzleRelations } from "drizzle-orm/relations";
import type { InferSelectModel } from "drizzle-orm/table";
import { baseTable } from "@/core/db/helper/entity";
import { collectionItems } from "../collection/schema";
import { media } from "../media/schema";
import { relations } from "../relation/schema";

export const items = pgTable("items", {
  ...baseTable,

  platform: text({ enum: PlatformValues }).notNull(),
  kind: text({ enum: KindValues }).notNull(),

  externalId: text().notNull(),
  url: text().notNull(),
  caption: text(),

  // user input
  favorite: boolean().default(false),
  note: text(),
  rate: integer(),

  deletedAt: timestamp({ withTimezone: true }),

  metadata: jsonb().$type<ItemMetadata>().notNull(),
});

export const itemsRelations = drizzleRelations(items, ({ many }) => ({
  outgoing: many(relations, { relationName: "fromItem" }),
  incoming: many(relations, { relationName: "toItem" }),
  media: many(media),
  collections: many(collectionItems),
}));

export type ItemEntity = InferSelectModel<typeof items>;
