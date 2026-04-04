// import { PlatformValues } from "@workspace/contracts/platform";
// import type { PostMetadata } from "@workspace/contracts/post";
// import { relations } from "drizzle-orm";
// import {
//   type AnyPgColumn,
//   boolean,
//   doublePrecision,
//   integer,
//   jsonb,
//   pgTable,
//   primaryKey,
//   text,
//   timestamp,
//   uuid,
// } from "drizzle-orm/pg-core";
// import { baseTable } from "@/core/db/helper/entity";
// import { collections } from "../collection/schema";
// import { creators } from "../creator/schema";
// import { tags } from "../tag/schema";

// export const posts = pgTable("posts", {
//   ...baseTable,

//   externalId: text().notNull(),
//   quotedPostId: uuid().references((): AnyPgColumn => posts.id, { onDelete: "set null" }),
//   url: text().notNull(),
//   caption: text(),
//   platform: text({ enum: PlatformValues }).notNull(),
//   favorite: boolean().default(false),
//   collectionId: uuid().references(() => collections.id),

//   note: text(),
//   rate: integer(),

//   creatorId: uuid()
//     .notNull()
//     .references(() => creators.id, { onDelete: "cascade" }),

//   deletedAt: timestamp(),

//   metadata: jsonb().$type<PostMetadata>().notNull(),
// });

// export const postTags = pgTable(
//   "post_tags",
//   {
//     postId: uuid()
//       .references(() => posts.id, { onDelete: "cascade" })
//       .notNull(),
//     tagId: uuid()
//       .references(() => tags.id, { onDelete: "cascade" })
//       .notNull(),
//   },
//   (t) => [primaryKey({ columns: [t.postId, t.tagId] })],
// );

// export const postTaggedCreators = pgTable(
//   "post_tagged_creators",
//   {
//     postId: uuid()
//       .references(() => posts.id, { onDelete: "cascade" })
//       .notNull(),
//     creatorId: uuid()
//       .references(() => creators.id, { onDelete: "cascade" })
//       .notNull(),
//     x: doublePrecision().notNull(),
//     y: doublePrecision().notNull(),
//   },
//   (t) => [primaryKey({ columns: [t.postId, t.creatorId] })],
// );

// export const postsRelations = relations(posts, ({ many, one }) => ({
//   taggedCreators: many(postTaggedCreators),
//   collection: one(collections, { fields: [posts.collectionId], references: [collections.id] }),
//   creator: one(creators, {
//     fields: [posts.creatorId],
//     references: [creators.id],
//   }),
//   tags: many(postTags),
//   quotedPost: one(posts, {
//     fields: [posts.quotedPostId],
//     references: [posts.id],
//   }),
// }));

// export const postsToTagsRelations = relations(postTags, ({ one }) => ({
//   tag: one(tags, {
//     fields: [postTags.tagId],
//     references: [tags.id],
//   }),
//   post: one(posts, {
//     fields: [postTags.postId],
//     references: [posts.id],
//   }),
// }));
