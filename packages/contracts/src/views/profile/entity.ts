import { z } from "zod";
import { ItemBaseViewSchema } from "../../core/item/entity";

export const ProfileSchema = ItemBaseViewSchema.extend({
  kind: z.literal("profile"),
  name: z.string(),
  username: z.string(),
  avatar: z.string(),
  postCount: z.number().optional(),
  tagCount: z.number().optional(),
});
