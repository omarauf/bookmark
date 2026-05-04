import { z } from "zod";
import { ItemSchema } from "../../core/item/entity";

export const ProfileSchema = ItemSchema.extend({
  name: z.string(),
  username: z.string(),
  avatar: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;
