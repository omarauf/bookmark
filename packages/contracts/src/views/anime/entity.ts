import { ItemSchema } from "../../core/item/entity";
import { AnimeMetadataSchema } from "../../platforms/anime";

export const AnimeItemSchema = ItemSchema.extend({
  metadata: AnimeMetadataSchema,
});
