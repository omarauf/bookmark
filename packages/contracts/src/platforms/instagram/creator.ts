import { z } from "zod";

export const InstagramMetadataCreatorSchema = z.object({
  platform: z.literal("instagram"),
  kind: z.literal("profile"),
  username: z.string(),
  verified: z.boolean().optional(),
  name: z.string().optional(),
});
