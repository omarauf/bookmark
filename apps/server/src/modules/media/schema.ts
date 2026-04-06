import { MediaTypeValues } from "@workspace/contracts/media";
import { PlatformValues } from "@workspace/contracts/platform";
import type { InferSelectModel } from "drizzle-orm";
import {
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { IdentifiedEntityModel } from "@/core/db/helper/entity";
import { items } from "../item/schema";

export const media = pgTable(
  "media",
  {
    ...IdentifiedEntityModel,

    itemId: uuid()
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),

    url: text().notNull(),
    platform: text({ enum: PlatformValues }).notNull(),
    type: text({ enum: MediaTypeValues }).notNull(),

    mime: text(),
    size: doublePrecision(),
    width: integer(),
    height: integer(),
    duration: doublePrecision(),

    placeholder: text(),

    key: text().notNull(),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex().on(table.key)],
);

export const mediaRelations = relations(media, ({ one }) => ({
  item: one(items, {
    relationName: "media",
    fields: [media.itemId],
    references: [items.id],
  }),
}));

export type Media = InferSelectModel<typeof media>;
