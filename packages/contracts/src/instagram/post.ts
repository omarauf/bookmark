import z from "zod";
import { CollectionSchema } from "../collection";
import { ObjectIdSchema } from "../common/object-id-schema";
import { BasePaginationQuerySchema } from "../common/pagination-query";
import { PostPlatformTypeEnum } from "../common/platform-type";
import { PostSchema } from "../post";
import { TagSchema } from "../tag";
import { InstagramLocationSchema } from "./location";
import { InstagramMediaSchema } from "./media";
import { InstagramMusicSchema } from "./music";
import { InstagramUserSchema, ParsedInstagramUserSchema } from "./user";
import { InstagramUserTagSchema } from "./user-tag";

const InstagramPostEntitySchema = PostSchema.extend({
  media: InstagramMediaSchema,
  userTags: InstagramUserTagSchema.extend({ user: ObjectIdSchema }).array(),
  location: InstagramLocationSchema.optional(),
  likes: z.number(),
  music: InstagramMusicSchema.optional(),
  caption: z.string().optional(),
  type: z.literal(PostPlatformTypeEnum["instagram-post"]),
});

export const InstagramPostSchema = InstagramPostEntitySchema.extend({
  userTags: InstagramUserTagSchema.extend({ user: z.string() }).array(),
});

export const PopulatedInstagramPostSchema = InstagramPostSchema.extend({
  creator: InstagramUserSchema,
  userTags: z.array(InstagramUserTagSchema),
  collections: z.array(CollectionSchema),
  tags: z.array(TagSchema),
});

export const CreateInstagramPostSchema = InstagramPostSchema.omit({
  _id: true,
  id: true,
  importedAt: true,
  updatedAt: true,
  downloadedAt: true,
  deletedAt: true,
});

export const ParsedInstagramPostSchema = z.object({
  postId: z.string(),
  media: InstagramMediaSchema,
  userTags: z.array(InstagramUserTagSchema),
  location: InstagramLocationSchema.optional(),
  likes: z.number(),
  music: InstagramMusicSchema.optional(),
  caption: z.string().optional(),
  creator: ParsedInstagramUserSchema,
  createdAt: z.date(),
  url: z.url(),
});

export const ListInstagramPostSchema = BasePaginationQuerySchema.extend({
  minDate: z.date().optional(),
  maxDate: z.date().optional(),
  username: z.string().optional(),
  collections: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  mediaType: z.enum(["image", "video", "carousel"]).optional(),
});

export type InstagramPostEntity = z.infer<typeof InstagramPostEntitySchema>;
export type InstagramPost = z.infer<typeof InstagramPostSchema>;
export type CreateInstagramPost = z.infer<typeof CreateInstagramPostSchema>;
export type ParsedInstagramPost = z.infer<typeof ParsedInstagramPostSchema>;
export type ListInstagramPosts = z.infer<typeof ListInstagramPostSchema>;
export type PopulatedInstagramPost = z.infer<typeof PopulatedInstagramPostSchema>;
