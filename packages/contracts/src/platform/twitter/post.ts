import z from "zod";
import { CreateBasePostSchema } from "../base/post";
import { CreateTwitterCreatorSchema } from "./creator";
import { TwitterMediaSchema } from "./media";

export const CreateTwitterPostSchema = CreateBasePostSchema.extend({
  externalId: z.string(),
  caption: z.string().optional(),
  createdAt: z.date(),
  url: z.url(),
  media: TwitterMediaSchema.array(),
  imageDescription: z.string().optional(),
  videoDescription: z.string().optional(),
  views: z.number(),
  likes: z.number(),
  quotes: z.number(),
  replies: z.number(),
  retweets: z.number(),
  bookmarks: z.number(),
  // creator: z.string(),
  creator: CreateTwitterCreatorSchema,
  platform: z.literal("twitter"),
  // externalQuotedId: z.string().optional(),
});

export const TwitterMetadataPostSchema = z.object({
  platform: z.literal("twitter"),
  quotedId: z.uuid().optional(),
  imageDescription: z.string().optional(),
  videoDescription: z.string().optional(),
  views: z.number(),
  likes: z.number(),
  quotes: z.number(),
  replies: z.number(),
  retweets: z.number(),
  bookmarks: z.number(),
});

// const CoreParsedTwitterPostSchema = z.object({
//   externalId: z.string(),
//   caption: z.string().optional(),
//   createdAt: z.date(),
//   url: z.url(),

//   media: TwitterMediaSchema.array(),
//   imageDescription: z.string().optional(),
//   videoDescription: z.string().optional(),
//   views: z.number(),
//   likes: z.number(),
//   quotes: z.number(),
//   replies: z.number(),
//   retweets: z.number(),
//   bookmarks: z.number(),
//   // creator: z.string(),
//   creator: CreateTwitterCreatorSchema,
// });

// // --------------------------------------------------------------------------

// export const CreateTwitterPostSchema = CreateBasePostSchema.extend({
//   ...CoreParsedTwitterPostSchema.shape,
//   platform: z.literal("twitter"),
//   quoted: CoreParsedTwitterPostSchema.optional(),
// });

// export const TwitterMetadataPostSchema = z.object({
//   platform: z.literal("twitter"),
//   quoted: CoreParsedTwitterPostSchema.optional(),

//   imageDescription: z.string().optional(),
//   videoDescription: z.string().optional(),
//   views: z.number(),
//   likes: z.number(),
//   quotes: z.number(),
//   replies: z.number(),
//   retweets: z.number(),
//   bookmarks: z.number(),
// });
