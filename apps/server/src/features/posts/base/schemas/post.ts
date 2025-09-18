import z from "zod";
import { ParsedUserSchema } from "./user";

export const ParsedPostSchema = z.object({
  postId: z.string(),
  caption: z.string().optional(),
  creator: ParsedUserSchema,
  createdAt: z.date(),
  url: z.url(),
});

export type ParsedPost = z.infer<typeof ParsedPostSchema>;
