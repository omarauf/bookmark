-- Preserve legacy item dates before removing the shared creation timestamp.
UPDATE "items" SET "published_at" = "created_at" WHERE "published_at" IS NULL;
--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "created_at";
