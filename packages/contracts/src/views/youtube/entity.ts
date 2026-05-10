import { ItemBaseViewSchema } from "../../core/item/entity";
import { YoutubeMetadataSchema } from "../../platforms/youtube";

export const YoutubeSchema = ItemBaseViewSchema.extend({
  ...YoutubeMetadataSchema.shape,
});
