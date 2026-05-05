import type { z } from "zod";
import { ItemSchema } from "../../core/item/entity";
import { AnimeMetadataSchema } from "../../platforms/anime";

export const AnimeItemSchema = ItemSchema.extend({
  metadata: AnimeMetadataSchema,
});

export type AnimeItem = z.infer<typeof AnimeItemSchema>;
