import z from "zod";
import { ItemSchema } from "../item/entity";

export const ProfileSchema = ItemSchema.extend({
  name: z.string(),
  username: z.string(),
  // media: NormalizedMediaSchema,
  avatar: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;
