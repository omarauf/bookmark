import { z } from "zod";
import { ItemSchema } from "../../core/item/entity";
import { MovieMetadataSchema, TvMetadataSchema } from "../../platforms/imdb";

export const ImdbItemSchema = ItemSchema.extend({
  metadata: z.discriminatedUnion("kind", [MovieMetadataSchema, TvMetadataSchema]),
});
