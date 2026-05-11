import { ItemBaseViewSchema } from "../../core/item/entity";
import { NormalizedMediaSchema } from "../../core/media";
import { YoutubeMetadataSchema } from "../../platforms/youtube";

// export const YoutubeMediaSchema = z.object({
//   key: z.string(),
//   type: z.enum(["image", "video", "gif"]),
//   size: z.number().optional(),
//   width: z.number().optional(),
//   height: z.number().optional(),
//   duration: z.number().optional(),
//   mime: z.string().optional(),
// });

export const YoutubeSchema = ItemBaseViewSchema.extend({
  ...YoutubeMetadataSchema.shape,
  media: NormalizedMediaSchema.array(),
});
