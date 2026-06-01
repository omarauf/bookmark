ALTER TABLE "jobs" DROP COLUMN "group_id";--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "ingest_id" uuid;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_ingest_id_ingests_id_fk" FOREIGN KEY ("ingest_id") REFERENCES "public"."ingests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
DROP TABLE "job_groups" CASCADE;
