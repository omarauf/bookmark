ALTER TABLE "imports" RENAME TO "ingests";--> statement-breakpoint
ALTER TABLE "ingests" RENAME COLUMN "imported_at" TO "ingested_at";--> statement-breakpoint
UPDATE "jobs" SET "type" = 'ingest_upload' WHERE "type" = 'import_upload';--> statement-breakpoint
UPDATE "jobs" SET "type" = 'ingest_process' WHERE "type" = 'import_process';--> statement-breakpoint
UPDATE "jobs" SET "resource_type" = 'ingest' WHERE "resource_type" = 'import';--> statement-breakpoint
UPDATE "jobs" SET "payload" = jsonb_set("payload" - 'importId', '{ingestId}', "payload"->'importId') WHERE "payload" ? 'importId';--> statement-breakpoint
UPDATE "job_groups" SET "name" = replace("name", 'import-', 'ingest-') WHERE "name" LIKE 'import-%';
