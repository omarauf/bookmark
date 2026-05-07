import { ItemSchema } from "../../core/item/entity";
import { YoutubeMetadataSchema } from "../../platforms/youtube";

export const YoutubeItemSchema = ItemSchema.extend({
  metadata: YoutubeMetadataSchema,
});
