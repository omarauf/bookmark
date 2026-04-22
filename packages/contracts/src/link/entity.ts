import z from "zod";

const PreviewSchema = z.object({
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

export const LinkSchema = z.object({
  id: z.string(),
  caption: z.string().optional(),
  url: z.url(),
  path: z.string(),
  preview: PreviewSchema.optional(),
  deletedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const PathTree = z.object({
  name: z.string(),
  path: z.string(),
  get children() {
    return PathTree.array().optional();
  },
});
