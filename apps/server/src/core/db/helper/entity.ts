import { timestamp, uuid } from "drizzle-orm/pg-core";
import { v7 as uuidV7 } from "uuid";

export const AuditedEntityModel = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),

  //   createdBy: text()
  //     .notNull()
  //     .references(() => users.id, { onDelete: "restrict" }),

  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  //   updatedBy: text()
  //     .notNull()
  //     .references(() => users.id, { onDelete: "restrict" }),
};

export const IdentifiedEntityModel = {
  id: uuid()
    .defaultRandom()
    .primaryKey()
    .$defaultFn(() => uuidV7()),
};

export const baseTable = {
  ...IdentifiedEntityModel,
  ...AuditedEntityModel,
};
