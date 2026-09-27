ALTER TABLE "jobs" DROP CONSTRAINT "jobs_group_id_job_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_scrape_id_scrapes_id_fk";
--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "processed_items";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "total_items";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "last_error_at";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "scrape_id";