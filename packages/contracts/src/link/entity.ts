import z from "zod";
import { PreviewSchema } from "../platform/chrome";

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
