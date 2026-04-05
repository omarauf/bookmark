ALTER TABLE "item_relations" RENAME TO "relations";--> statement-breakpoint
ALTER TABLE "relations" DROP CONSTRAINT "item_relations_from_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "relations" DROP CONSTRAINT "item_relations_to_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "relations" DROP CONSTRAINT "item_relations_from_item_id_to_item_id_relation_type_pk";--> statement-breakpoint
ALTER TABLE "relations" ADD CONSTRAINT "relations_from_item_id_to_item_id_relation_type_pk" PRIMARY KEY("from_item_id","to_item_id","relation_type");--> statement-breakpoint
ALTER TABLE "relations" ADD CONSTRAINT "relations_from_item_id_items_id_fk" FOREIGN KEY ("from_item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relations" ADD CONSTRAINT "relations_to_item_id_items_id_fk" FOREIGN KEY ("to_item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;