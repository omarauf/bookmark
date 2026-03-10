import z from "zod";
import { CollectionSchema } from "../collection";
import { BasePaginationQuerySchema } from "../common/pagination-query";
import { PostPlatformTypeEnum } from "../common/platform-type";
import { PostSchema } from "../post";
import { TagSchema } from "../tag";
import { TiktokImageMediaSchema, TiktokVideoMediaSchema } from "./media";
import { TiktokMusicSchema } from "./music";
import { TiktokUserSchema } from "./user";

const TiktokPostSchema = PostSchema.extend({
  media: z
    .discriminatedUnion("mediaType", [TiktokImageMediaSchema, TiktokVideoMediaSchema])
    .array(),
  likes: z.number(),
  comments: z.number(),
  shares: z.number(),
  plays: z.number(),
  collects: z.number(),
  creator: z.string(),
  music: TiktokMusicSchema,
  type: z.literal(PostPlatformTypeEnum["tiktok-post"]),
});

// --------------------------------------------------------------------------

export const PopulatedTiktokPostSchema = TiktokPostSchema.extend({
  creator: TiktokUserSchema,
  collections: z.array(CollectionSchema),
  tags: z.array(TagSchema),
});

export const CreateTiktokPostSchema = TiktokPostSchema.omit({
  _id: true,
  id: true,
  importedAt: true,
  updatedAt: true,
  downloadedAt: true,
  deletedAt: true,
});

export const ListTiktokPostSchema = BasePaginationQuerySchema.extend({
  minDate: z.date().optional(),
  maxDate: z.date().optional(),
  username: z.string().optional(),
  collections: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type TiktokPost = z.infer<typeof TiktokPostSchema>;
export type CreateTiktokPost = z.infer<typeof CreateTiktokPostSchema>;
export type ListTiktokPosts = z.infer<typeof ListTiktokPostSchema>;
export type PopulatedTiktokPost = z.infer<typeof PopulatedTiktokPostSchema>;
