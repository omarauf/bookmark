import { z } from "zod";
import { ItemSchema } from "../../core/item/entity";

export const ProfileSchema = ItemSchema.extend({
  name: z.string(),
  username: z.string(),
  avatar: z.string(),
  postCount: z.number().optional(),
  tagCount: z.number().optional(),
});
