ALTER TABLE "media" RENAME COLUMN "reference_id" TO "item_id";--> statement-breakpoint
ALTER TABLE "media" DROP CONSTRAINT "media_reference_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;