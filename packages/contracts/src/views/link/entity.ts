import { z } from "zod";
import { ItemSchema } from "../../core/item/entity";
import { PreviewSchema } from "../../platforms/chrome";

export const LinkSchema = ItemSchema.extend({
  path: z.string(),
  preview: PreviewSchema.optional(),
});

export const FolderTreeSchema = z.object({
  name: z.string(),
  path: z.string(),
  get children() {
    return FolderTreeSchema.array().optional();
  },
});
