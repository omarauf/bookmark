import { RelationValues } from "@workspace/contracts/relation";
import { doublePrecision, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations as drizzleRelations } from "drizzle-orm/relations";
import type { InferSelectModel } from "drizzle-orm/table";
import { items } from "../item/schema";

export const relations = pgTable(
  "relations",
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

export const itemRelationsRelations = drizzleRelations(relations, ({ one }) => ({
  fromItem: one(items, {
    fields: [relations.fromItemId],
    references: [items.id],
    relationName: "fromItem",
  }),
  toItem: one(items, {
    fields: [relations.toItemId],
    references: [items.id],
    relationName: "toItem",
  }),
}));

export type RelationEntity = InferSelectModel<typeof relations>;
