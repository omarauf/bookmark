import z from "zod";
import { ItemSchema } from "../item/entity";
import { PreviewSchema } from "../platform/chrome";

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
