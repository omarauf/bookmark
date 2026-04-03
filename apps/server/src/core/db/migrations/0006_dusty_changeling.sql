ALTER TABLE "posts" ALTER COLUMN "metadata" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "download_tasks" ADD COLUMN "key" text NOT NULL;