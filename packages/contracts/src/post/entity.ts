import z from "zod";
import { CollectionSummarySchema } from "../collection/entity";
import { ItemSchema } from "../item/entity";
import { NormalizedMediaSchema } from "../media";
import { ProfileSchema } from "../profile";

export const PostSchema = ItemSchema.extend({
  media: NormalizedMediaSchema.array(),
  creator: ProfileSchema,
  taggedItems: ProfileSchema.extend({ x: z.number(), y: z.number() }).array(),
  collections: CollectionSummarySchema.array(),
});
