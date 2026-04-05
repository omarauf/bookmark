import { DownloadStatusValues } from "@workspace/contracts/download-task";
import { PlatformValues } from "@workspace/contracts/platform";
import type { InferSelectModel } from "drizzle-orm";
import { doublePrecision, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { MediaTypeValues } from "node_modules/@workspace/contracts/src/media/enum";
import { IdentifiedEntityModel } from "@/core/db/helper/entity";

export const downloadTasks = pgTable("download_tasks", {
  ...IdentifiedEntityModel,

  url: text().notNull(),
  type: text({ enum: MediaTypeValues }).notNull(),
  platform: text({ enum: PlatformValues }).notNull(),
  status: text({ enum: DownloadStatusValues }).notNull().default("pending"),
  error: text(),
  externalId: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  completedAt: timestamp(),
  key: text().notNull(),

  size: doublePrecision(),
  width: integer(),
  height: integer(),
  duration: doublePrecision(),
});

export type DownloadTask = InferSelectModel<typeof downloadTasks>;
