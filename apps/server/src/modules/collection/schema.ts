import {
  foreignKey,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { baseTable } from "@/core/db/helper/entity";
import { ltree } from "@/core/db/types/ltree";
import { items } from "../item/schema";

export const collections = pgTable(
  "collections",
  {
    ...baseTable,

    label: text().notNull(),
    color: text().notNull(),

    path: ltree().notNull().unique(),

    parentId: uuid(),

    level: integer().notNull(),

    slug: text().notNull(),
  },
  (t) => [
    index().using("gist", t.path),

    foreignKey({
      name: "collections_parent_id_fk",
      columns: [t.parentId],
      foreignColumns: [t.id],
    })
      .onDelete("restrict")
      .onUpdate("cascade"),
  ],
);

export const collectionsRelations = relations(collections, ({ many }) => ({
  items: many(collectionItems),
}));

export const collectionItems = pgTable(
  "collection_items",
  {
    collectionId: uuid()
      .references(() => collections.id, { onDelete: "cascade" })
      .notNull(),

    itemId: uuid()
      .references(() => items.id, { onDelete: "cascade" })
      .notNull(),

    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.collectionId, t.itemId] })],
);

export const collectionItemsRelations = relations(collectionItems, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionItems.collectionId],
    references: [collections.id],
  }),
  item: one(items, {
    fields: [collectionItems.itemId],
    references: [items.id],
  }),
}));

export type CollectionItemEntity = typeof collectionItems.$inferSelect;
export type CollectionEntity = typeof collections.$inferSelect;
