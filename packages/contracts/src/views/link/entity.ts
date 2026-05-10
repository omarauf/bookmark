import { z } from "zod";
import { ItemBaseViewSchema } from "../../core/item/entity";
import { ChromeLinkMetadataSchema } from "../../platforms/chrome";

export const LinkSchema = ItemBaseViewSchema.extend({
  ...ChromeLinkMetadataSchema.shape,
});

export const FolderTreeSchema = z.object({
  name: z.string(),
  path: z.string(),
  get children() {
    return FolderTreeSchema.array().optional();
  },
});
