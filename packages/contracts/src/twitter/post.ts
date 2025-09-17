import z from "zod";
import { CollectionSchema } from "../collection";
import { BasePaginationQuerySchema } from "../common/pagination-query";
import { PostPlatformTypeEnum } from "../common/platform-type";
import { PostSchema } from "../post";
import { TagSchema } from "../tag";
import { TwitterGifMediaSchema, TwitterImageMediaSchema, TwitterVideoMediaSchema } from "./media";
import { TwitterUserSchema } from "./user";

const CoreParsedTwitterPostSchema = z.object({
  postId: z.string(),
  media: z
    .discriminatedUnion("mediaType", [
      TwitterImageMediaSchema,
      TwitterVideoMediaSchema,
      TwitterGifMediaSchema,
    ])
    .array(),
  caption: z.string().optional(),
  createdAt: z.date(),
  url: z.url(),
  imageDescription: z.string().optional(),
  videoDescription: z.string().optional(),
  views: z.number(),
  likes: z.number(),
  quotes: z.number(),
  replies: z.number(),
  retweets: z.number(),
  bookmarks: z.number(),
  creator: z.string(),
});

const TwitterPostSchema = z.object({
  ...CoreParsedTwitterPostSchema.shape,
  ...PostSchema.shape,
  caption: z.string().optional(), // TODO: move to PostSchema
  type: z.literal(PostPlatformTypeEnum["twitter-post"]),
  quoted: CoreParsedTwitterPostSchema.optional(),
});

// --------------------------------------------------------------------------

export const PopulatedTwitterPostSchema = TwitterPostSchema.extend({
  creator: TwitterUserSchema,
  quoted: CoreParsedTwitterPostSchema.extend({ creator: TwitterUserSchema }).optional(),
  collections: z.array(CollectionSchema),
  tags: z.array(TagSchema),
});

export const CreateTwitterPostSchema = TwitterPostSchema.omit({
  _id: true,
  id: true,
  importedAt: true,
  updatedAt: true,
  downloadedAt: true,
  deletedAt: true,
});

export const ListTwitterPostSchema = BasePaginationQuerySchema.extend({
  minDate: z.date().optional(),
  maxDate: z.date().optional(),
  username: z.string().optional(),
  collections: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

// export type TwitterPostEntity = z.infer<typeof TwitterPostEntitySchema>;
export type TwitterPost = z.infer<typeof TwitterPostSchema>;
export type CreateTwitterPost = z.infer<typeof CreateTwitterPostSchema>;
export type ListTwitterPosts = z.infer<typeof ListTwitterPostSchema>;
export type PopulatedTwitterPost = z.infer<typeof PopulatedTwitterPostSchema>;

// import z from "zod";
// import { CollectionSchema } from "../collection";
// import { ObjectIdSchema } from "../common/object-id-schema";
// import { BasePaginationQuerySchema } from "../common/pagination-query";
// import { PostPlatformTypeEnum } from "../common/platform-type";
// import { PostSchema } from "../post";
// import { TagSchema } from "../tag";
// import { TwitterUserSchema } from "./user";

// const CoreParsedTwitterPostSchema = z.object({
//   postId: z.string(),
//   media: z.string().array(),
//   caption: z.string().optional(),
//   createdAt: z.date(),
//   url: z.url(),
//   like: z.number(),
//   quote: z.number(),
//   reply: z.number(),
//   retweet: z.number(),
//   bookmark: z.number(),
//   creator: z.union([z.string(), ObjectIdSchema]),
// });

// const TwitterPostEntitySchema = PostSchema.extend({
//   media: z.string().array(),
//   caption: z.string().optional(),
//   type: z.literal(PostPlatformTypeEnum["twitter-post"]),
//   like: z.number(),
//   quote: z.number(),
//   reply: z.number(),
//   retweet: z.number(),
//   bookmark: z.number(),
//   quoted: CoreParsedTwitterPostSchema.extend({ creator: ObjectIdSchema }).optional(),
// });

// // --------------------------------------------------------------------------

// const TwitterPostSchema = TwitterPostEntitySchema.extend({
//   quoted: CoreParsedTwitterPostSchema.extend({ creator: z.string() }).optional(),
// });

// export const PopulatedTwitterPostSchema = TwitterPostSchema.extend({
//   creator: TwitterUserSchema,
//   quoted: CoreParsedTwitterPostSchema.extend({ creator: TwitterUserSchema }).optional(),
//   collections: z.array(CollectionSchema),
//   tags: z.array(TagSchema),
// });

// export const CreateTwitterPostSchema = TwitterPostSchema.omit({
//   _id: true,
//   id: true,
//   importedAt: true,
//   updatedAt: true,
//   downloadedAt: true,
//   deletedAt: true,
// });

// export const ListTwitterPostSchema = BasePaginationQuerySchema.extend({
//   minDate: z.date().optional(),
//   maxDate: z.date().optional(),
//   username: z.string().optional(),
//   collections: z.array(z.string()).optional(),
//   tags: z.array(z.string()).optional(),
// });

// export type TwitterPostEntity = z.infer<typeof TwitterPostEntitySchema>;
// export type TwitterPost = z.infer<typeof TwitterPostSchema>;
// export type CreateTwitterPost = z.infer<typeof CreateTwitterPostSchema>;
// export type ListTwitterPosts = z.infer<typeof ListTwitterPostSchema>;
// export type PopulatedTwitterPost = z.infer<typeof PopulatedTwitterPostSchema>;
