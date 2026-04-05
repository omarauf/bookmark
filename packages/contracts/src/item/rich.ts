import z from "zod";
import { NormalizedMediaSchema } from "../media";
import { ItemSchema } from "./entity";

export const ItemWithMediaSchema = ItemSchema.extend({
  media: NormalizedMediaSchema.array(),
});
// const ItemWithMediaSchema = ItemSchema.and(z.object({ media: MediaSchema.array() }));

// const RichItemRelationSchema = ItemRelationSchema.extend({
//   item: ItemWithMediaSchema,
// });

// export type RichItemRelation = z.infer<typeof RichItemRelationSchema>;

// export const RichItemSchema = ItemWithMediaSchema.and(
//   z.object({
//     relation: RichItemRelationSchema.array(),
//   }),
// );

// export type RichItem = z.infer<typeof RichItemSchema>;

export const RichItemSchema = ItemWithMediaSchema.extend({
  creator: ItemWithMediaSchema,
  taggedItems: ItemWithMediaSchema.extend({ x: z.number(), y: z.number() }).array(),
});

export type ItemWithMedia = z.infer<typeof ItemWithMediaSchema>;
export type RichItem = z.infer<typeof RichItemSchema>;
