CREATE TABLE "links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text,
	"url" text NOT NULL,
	"folder" text NOT NULL,
	"path" text NOT NULL,
	"preview" jsonb,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "creators" ALTER COLUMN "metadata" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "imports" ADD COLUMN "imported_at" timestamp;--> statement-breakpoint
ALTER TABLE "creators" DROP COLUMN "downloaded_at";--> statement-breakpoint
ALTER TABLE "imports" DROP COLUMN "downloaded_at";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "downloaded_at";