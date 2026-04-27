import { index, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { baseTable } from "@/core/db/helper/entity";
import { items } from "../item/schema";

export const tags = pgTable("tags", {
  ...baseTable,

  name: text().notNull(),
  color: text().notNull(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  items: many(itemTags),
}));

export const itemTags = pgTable(
  "item_tags",
  {
    tagId: uuid()
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),

    itemId: uuid()
      .references(() => items.id, { onDelete: "cascade" })
      .notNull(),

    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.tagId, t.itemId] }),
    index("item_tags_item_id_idx").on(t.itemId),
  ],
);

export const itemTagsRelations = relations(itemTags, ({ one }) => ({
  tag: one(tags, {
    fields: [itemTags.tagId],
    references: [tags.id],
  }),
  item: one(items, {
    fields: [itemTags.itemId],
    references: [items.id],
  }),
}));
