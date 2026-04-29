import { z } from "zod";

export const TwitterMetadataCreatorSchema = z.object({
  platform: z.literal("twitter"),
  kind: z.literal("profile"),
  username: z.string(),
  verified: z.boolean().optional(),
  name: z.string().optional(),
  location: z.string().optional(),
});
