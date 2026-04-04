// import { boolean, jsonb, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
// import { PlatformValues } from "@/contracts/common";
// import { baseTable } from "@/core/db/helper/entity";

// export const creators = pgTable(
//   "creators",
//   {
//     ...baseTable,

//     platform: text({ enum: PlatformValues }).notNull(),
//     externalId: text().notNull(),
//     url: text().notNull(),
//     username: text().notNull(),
//     name: text(),
//     verified: boolean(),

//     metadata: jsonb().$type<CreatorMetadata>().notNull(),
//   },
//   (t) => [uniqueIndex().on(t.platform, t.externalId)],
// );
