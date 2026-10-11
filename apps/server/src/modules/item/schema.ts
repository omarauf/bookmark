import type { ItemMetadata } from "@workspace/contracts/item";
import { KindValues, PlatformValues } from "@workspace/contracts/platform";
import { boolean, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations as drizzleRelations } from "drizzle-orm/relations";
import type { InferSelectModel } from "drizzle-orm/table";
import { AuditedEntityModel, IdentifiedEntityModel } from "@/core/db/helper/entity";
import { collectionItems } from "../collection/schema";
import { media } from "../media/schema";
import { relations } from "../relation/schema";
import { itemTags } from "../tag/schema";

export const items = pgTable("items", {
  ...IdentifiedEntityModel,
  updatedAt: AuditedEntityModel.updatedAt,

  platform: text({ enum: PlatformValues }).notNull(),
  kind: text({ enum: KindValues }).notNull(),

  externalId: text().notNull(),
  url: text().notNull(),
  caption: text(),
  addedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp({ withTimezone: true }),

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
  tags: many(itemTags),
}));

export type ItemEntity = InferSelectModel<typeof items>;
