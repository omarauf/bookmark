CREATE TABLE "job_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"level" text NOT NULL,
	"message" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid,
	"type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"resource_type" text,
	"resource_id" text,
	"payload" jsonb,
	"progress" integer,
	"processed_items" integer,
	"total_items" integer,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 3 NOT NULL,
	"retry_at" timestamp,
	"error" text,
	"error_detail" text,
	"last_error_at" timestamp,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "item_tags" (
	"tag_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "item_tags_tag_id_item_id_pk" PRIMARY KEY("tag_id","item_id")
);
--> statement-breakpoint
ALTER TABLE "download_tasks" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "download_tasks" CASCADE;--> statement-breakpoint
ALTER TABLE "job_logs" ADD CONSTRAINT "job_logs_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_group_id_job_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."job_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_tags" ADD CONSTRAINT "item_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_tags" ADD CONSTRAINT "item_tags_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_active_job_resource" ON "jobs" USING btree ("type","resource_id") WHERE "jobs"."status" IN ('pending', 'processing', 'retrying');--> statement-breakpoint
CREATE INDEX "item_tags_item_id_idx" ON "item_tags" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "collection_items_item_id_idx" ON "collection_items" USING btree ("item_id");