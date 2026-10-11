ALTER TABLE "items" ADD COLUMN "published_at" timestamp with time zone;
--> statement-breakpoint
-- Preserve existing post publication dates and restore created_at to the item insertion date.
UPDATE "items"
SET "published_at" = "created_at", "created_at" = "added_at"
WHERE "kind" = 'post';
