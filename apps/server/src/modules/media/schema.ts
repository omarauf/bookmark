import { MediaTypeValues, ReferenceTypeValues } from "@workspace/contracts/media";
import { PlatformValues } from "@workspace/contracts/platform";
import {
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { IdentifiedEntityModel } from "@/core/db/helper/entity";

export const media = pgTable(
  "media",
  {
    ...IdentifiedEntityModel,

    referenceId: uuid().notNull(),
    referenceType: text({ enum: ReferenceTypeValues }).notNull(),

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
