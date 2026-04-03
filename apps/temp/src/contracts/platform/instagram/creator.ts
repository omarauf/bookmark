import z from "zod";
import { CreateBaseItemSchema } from "../base/item";

export const InstagramMetadataCreatorSchema = z.object({
  username: z.string(),
  verified: z.boolean().optional(),
  name: z.string().optional(),
});

export const CreateInstagramCreatorSchema = CreateBaseItemSchema.extend({
  platform: z.literal("instagram"),
  kind: z.literal("profile"),
  metadata: InstagramMetadataCreatorSchema,
});
