import z from "zod";
import { BasePaginationQuerySchema } from "./common/pagination-query";
import { PostPlatformTypeSchema } from "./common/platform-type";

export const PostSchema = z.object({
  _id: z.string(),
  id: z.string(),
  postId: z.string(),
  creator: z.string(),
  type: PostPlatformTypeSchema,
  url: z.url(),
  favorite: z.boolean().optional(),
  tags: z.array(z.string()),
  collections: z.array(z.string()),
  note: z.string().optional(),
  rate: z.number().min(0).max(10).optional(),
  deletedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date(),
  importedAt: z.date(),
  downloadedAt: z.date().optional(),
  savedAt: z.date().optional(),
  caption: z.string().optional(),
});

export const ListPostSchema = BasePaginationQuerySchema.extend({});

export const CreatePostSchema = PostSchema.omit({
  _id: true,
  id: true,
  importedAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const UpdatePostSchema = PostSchema.pick({
  id: true,
  note: true,
  rate: true,
  tags: true,
  collections: true,
  favorite: true,
});

export const DeletePostSchema = PostSchema.pick({ id: true }).extend({
  hard: z.boolean().optional(),
});

export const DeleteAllPostSchema = z.object({
  hard: z.boolean().optional(),
});

export type Post = z.infer<typeof PostSchema>;
export type CreatePost = z.infer<typeof CreatePostSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;
export type ListPosts = z.infer<typeof ListPostSchema>;
export type DeletePost = z.infer<typeof DeletePostSchema>;

// export const FilePathSchema = z.union([
//   z.string().regex(/^json\/.+\.json$/, "Invalid json file path"),
//   z.string().regex(/^link\/.+\.jpg$/, "Invalid link jpg file path"),
//   z.string().regex(/^instagram\/user\/.+\.jpg$/, "Invalid instagram user jpg file path"),
//   z.string().regex(/^instagram\/video\/.+\.jpg$/, "Invalid instagram video jpg file path"),
//   z.string().regex(/^instagram\/image\/.+\.jpg$/, "Invalid instagram image jpg file path"),
//   z.string().regex(/^instagram\/video\/.+\.mp4$/, "Invalid instagram video mp4 file path"),
//   z
//     .string()
//     .regex(/^instagram\/carousel\/.+-\d+\.jpg$/, "Invalid instagram carousel jpg file path"),
//   z
//     .string()
//     .regex(/^instagram\/carousel\/.+-\d+\.mp4$/, "Invalid instagram carousel mp4 file path"),
// ]);

// export type FilePath = z.infer<typeof FilePathSchema>;
