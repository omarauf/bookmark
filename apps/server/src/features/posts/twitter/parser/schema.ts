import {
  TwitterGifMediaSchema,
  TwitterImageMediaSchema,
  TwitterVideoMediaSchema,
} from "@workspace/contracts/twitter/media";
import z from "zod";

const ParsedTwitterUserSchema = z.object({
  userId: z.string(),
  url: z.url(),
  username: z.string(),
  profilePicture: z.string().optional(),
  name: z.string().optional(),
  createdAt: z.date(),
  verified: z.boolean(),
  location: z.string().optional(),
});

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
  creator: ParsedTwitterUserSchema,
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
});

export const ParsedTwitterPostSchema = CoreParsedTwitterPostSchema.extend({
  quoted: CoreParsedTwitterPostSchema.optional(),
});

export type ParsedTwitterUser = z.infer<typeof ParsedTwitterUserSchema>;
export type ParsedTwitterPost = z.infer<typeof ParsedTwitterPostSchema>;
