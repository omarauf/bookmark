import { z } from "zod";

export const TiktokMetadataCreatorSchema = z.object({
  platform: z.literal("tiktok"),
  kind: z.literal("profile"),
  username: z.string(),
  verified: z.boolean().optional(),
  name: z.string().optional(),
});
