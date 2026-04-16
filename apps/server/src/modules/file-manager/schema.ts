import {
  FileExtensionValues,
  type FileMetadata,
  FileTypeValues,
  MimeTypeValues,
} from "@workspace/contracts/file-manager";
import { relations } from "drizzle-orm";
import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const folders = pgTable("folders", {
  id: uuid().primaryKey().defaultRandom(),

  name: text().notNull(),

  parentId: uuid(),

  createdAt: timestamp().defaultNow().notNull(),
});

export const foldersRelations = relations(folders, ({ one, many }) => ({
  // 🔼 Parent folder (many → one)
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
  }),

  // 🔽 Child folders (one → many)
  children: many(folders),

  // 📄 Files inside this folder
  files: many(files),
}));

export const files = pgTable("files", {
  id: uuid().primaryKey().defaultRandom(),

  name: text().notNull(),

  mimeType: text({ enum: MimeTypeValues }).notNull(),

  size: integer().notNull(),

  type: text({ enum: FileTypeValues }).notNull(),

  extension: text({ enum: FileExtensionValues }).notNull(),

  s3Key: text().notNull(),

  folderId: uuid().references(() => folders.id, { onDelete: "cascade" }),

  metadata: jsonb().$type<FileMetadata>(),

  isDeleted: boolean().default(false),

  createdAt: timestamp().defaultNow().notNull(),
});

export const filesRelations = relations(files, ({ one }) => ({
  folder: one(folders, {
    fields: [files.folderId],
    references: [folders.id],
  }),
}));
