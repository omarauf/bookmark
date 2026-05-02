import type { JobPayload } from "@workspace/contracts/job";
import { JobStatusValues, JobTypeValues, LogLevelValues } from "@workspace/contracts/job";
import { relations, sql } from "drizzle-orm";
import { integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { IdentifiedEntityModel } from "@/core/db/helper/entity";

export const jobGroups = pgTable("job_groups", {
  ...IdentifiedEntityModel,

  name: text().notNull(),

  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const jobs = pgTable(
  "jobs",
  {
    ...IdentifiedEntityModel,

    groupId: uuid().references(() => jobGroups.id, { onDelete: "cascade" }),

    type: text({ enum: JobTypeValues }).notNull(),
    status: text({ enum: JobStatusValues }).notNull().default("pending"),

    resourceType: text(),
    resourceId: text(),

    payload: jsonb().$type<JobPayload>(),

    progress: integer(),
    processedItems: integer(),
    totalItems: integer(),

    attemptCount: integer().notNull().default(0),
    maxAttempts: integer().notNull().default(3),
    retryAt: timestamp(),

    error: text(),
    errorDetail: text(),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    startedAt: timestamp({ withTimezone: true }),
    completedAt: timestamp({ withTimezone: true }),
    failedAt: timestamp({ withTimezone: true }),
    cancelledAt: timestamp({ withTimezone: true }),
  },
  (table) => [
    uniqueIndex("unique_active_job_resource")
      .on(table.type, table.resourceId)
      .where(sql`${table.status} IN ('pending', 'processing', 'retrying')`),
  ],
);

export const jobLogs = pgTable("job_logs", {
  ...IdentifiedEntityModel,

  jobId: uuid()
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),

  level: text({ enum: LogLevelValues }).notNull(),
  message: text().notNull(),
  metadata: jsonb(),

  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const jobGroupsRelations = relations(jobGroups, ({ many }) => ({
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  group: one(jobGroups, { fields: [jobs.groupId], references: [jobGroups.id] }),
  logs: many(jobLogs),
}));

export const jobLogsRelations = relations(jobLogs, ({ one }) => ({
  job: one(jobs, {
    fields: [jobLogs.jobId],
    references: [jobs.id],
  }),
}));
