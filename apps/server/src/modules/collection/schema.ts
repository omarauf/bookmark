import { foreignKey, index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { baseTable } from "@/core/db/helper/entity";
import { ltree } from "@/core/db/types/ltree";

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
