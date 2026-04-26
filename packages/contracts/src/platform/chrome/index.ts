import z from "zod";

export const PreviewSchema = z.object({
  url: z.string(),
  mediaType: z.string(),
  favicons: z.array(z.string()),
  title: z.string().optional(),
  charset: z.string().optional(),
  siteName: z.string().optional(),
  description: z.string().optional(),
  contentType: z.string().optional(),
  images: z.array(z.string()).optional(),
  videos: z
    .array(
      z.object({
        url: z.string().optional(),
        secureUrl: z.string().nullable().optional(),
        type: z.string().nullable().optional(),
        width: z.string().optional(),
        height: z.string().optional(),
      }),
    )
    .optional(),
});

export const ChromeLinkMetadataSchema = z.object({
  platform: z.literal("chrome"),
  kind: z.literal("link"),
  lastUsedAt: z.date().optional(),
  path: z.string(),
  preview: PreviewSchema.optional(),
});
