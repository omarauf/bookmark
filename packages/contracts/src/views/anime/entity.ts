import { ItemBaseViewSchema } from "../../core/item/entity";
import { AnimeMetadataSchema } from "../../platforms/anime";

export const AnimeSchema = ItemBaseViewSchema.extend({
  ...AnimeMetadataSchema.shape,
});
