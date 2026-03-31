CREATE EXTENSION IF NOT EXISTS "ltree";
ALTER TABLE "collections" RENAME COLUMN "name" TO "label";--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "path" "ltree" NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "level" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "collection_id" uuid;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."collections"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "collections_path_index" ON "collections" USING gist ("path");--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_path_unique" UNIQUE("path");