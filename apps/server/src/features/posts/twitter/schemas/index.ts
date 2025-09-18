import {
  TwitterGifMediaSchema,
  TwitterImageMediaSchema,
  TwitterVideoMediaSchema,
} from "@workspace/contracts/twitter/media";
import z from "zod";
import { type ParsedPost, ParsedPostSchema } from "../../base/schemas/post";
import { type ParsedUser, ParsedUserSchema } from "../../base/schemas/user";

const ParsedTwitterUserSchema = ParsedUserSchema.extend({
  location: z.string().optional(),
});

const CoreParsedTwitterPostSchema = ParsedPostSchema.extend({
  media: z
    .discriminatedUnion("mediaType", [
      TwitterImageMediaSchema,
      TwitterVideoMediaSchema,
      TwitterGifMediaSchema,
    ])
    .array(),
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

export type ParsedTwitterUser = z.infer<typeof ParsedTwitterUserSchema> & ParsedUser;
export type ParsedTwitterPost = z.infer<typeof ParsedTwitterPostSchema> & ParsedPost;
