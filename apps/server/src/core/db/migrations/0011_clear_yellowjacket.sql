ALTER TABLE "items" ADD COLUMN "added_at" timestamp with time zone DEFAULT now() NOT NULL;
--> statement-breakpoint
-- UUIDv7 IDs record when the item was inserted. Older IDs fall back to the last recorded update.
UPDATE "items"
SET "added_at" = CASE
  WHEN substring("id"::text, 15, 1) = '7' THEN
    to_timestamp((('x' || replace(left("id"::text, 13), '-', ''))::bit(48)::bigint)::double precision / 1000)
  ELSE "updated_at"
END;
