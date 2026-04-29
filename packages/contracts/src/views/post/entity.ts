import { z } from "zod";
import { CollectionSummarySchema } from "../../core/collection/entity";
import { ItemSchema } from "../../core/item/entity";
import { NormalizedMediaSchema } from "../../core/media";
import { TagSchema } from "../../core/tag";
import { ProfileSchema } from "../profile";

export const PostSchema = ItemSchema.extend({
  media: NormalizedMediaSchema.array(),
  creator: ProfileSchema,
  taggedItems: ProfileSchema.extend({ x: z.number(), y: z.number() }).array(),
  collections: CollectionSummarySchema.array(),
  tags: TagSchema.array(),
});
