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
import { KindValues, PlatformValues, RelationValues } from "@/contracts/common";
import type { ItemMetadata } from "@/contracts/item";
import { baseTable } from "@/core/db/helper/entity";

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
