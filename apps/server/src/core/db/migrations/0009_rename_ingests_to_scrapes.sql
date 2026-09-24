ALTER TABLE "ingests" RENAME TO "scrapes";--> statement-breakpoint
ALTER TABLE "scrapes" RENAME COLUMN "ingested_at" TO "processed_at";--> statement-breakpoint
ALTER TABLE "jobs" RENAME COLUMN "ingest_id" TO "scrape_id";--> statement-breakpoint
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_ingest_id_ingests_id_fk";--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_scrape_id_scrapes_id_fk" FOREIGN KEY ("scrape_id") REFERENCES "public"."scrapes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
UPDATE "jobs" SET "type" = 'scrape_upload' WHERE "type" = 'ingest_upload';--> statement-breakpoint
UPDATE "jobs" SET "type" = 'scrape_process' WHERE "type" = 'ingest_process';--> statement-breakpoint
UPDATE "jobs" SET "resource_type" = 'scrape' WHERE "resource_type" = 'ingest';--> statement-breakpoint
UPDATE "jobs" SET "payload" = jsonb_set("payload" - 'ingestId', '{scrapeId}', "payload"->'ingestId') WHERE "payload" ? 'ingestId';
