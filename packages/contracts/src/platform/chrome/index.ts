import z from "zod";

export const ChromeLinkMetadataSchema = z.object({
  platform: z.literal("chrome"),
  kind: z.literal("link"),
  lastUsedAt: z.date().optional(),
  path: z.string(),
});
