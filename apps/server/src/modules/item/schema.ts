import type { ItemMetadata } from "@workspace/contracts/item";
import { RelationValues } from "@workspace/contracts/item-relation";
import { KindValues, PlatformValues } from "@workspace/contracts/platform";
import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import type { InferSelectModel } from "drizzle-orm/table";
import { baseTable } from "@/core/db/helper/entity";
import { media } from "../media/schema";

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

export const itemsRelations = relations(items, ({ many }) => ({
  outgoing: many(itemRelations, { relationName: "fromItem" }),
  incoming: many(itemRelations, { relationName: "toItem" }),
  media: many(media, { relationName: "media" }),
}));

export const itemRelations = pgTable(
  "item_relations",
  {
    fromItemId: uuid()
      .references(() => items.id, { onDelete: "cascade" })
      .notNull(),

    toItemId: uuid()
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),

    relationType: text({ enum: RelationValues }).notNull(),

    x: doublePrecision().notNull(),
    y: doublePrecision().notNull(),

    createdAt: timestamp({ withTimezone: false }).defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.fromItemId, t.toItemId, t.relationType] })],
);

export const itemRelationsRelations = relations(itemRelations, ({ one }) => ({
  fromItem: one(items, {
    fields: [itemRelations.fromItemId],
    references: [items.id],
    relationName: "fromItem",
  }),
  toItem: one(items, {
    fields: [itemRelations.toItemId],
    references: [items.id],
    relationName: "toItem",
  }),
}));

export type ItemEntity = InferSelectModel<typeof items>;
export type RelationEntity = InferSelectModel<typeof itemRelations>;
