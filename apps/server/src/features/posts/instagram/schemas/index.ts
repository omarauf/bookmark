import { InstagramLocationSchema } from "@workspace/contracts/instagram/location";
import { InstagramMediaSchema } from "@workspace/contracts/instagram/media";
import { InstagramMusicSchema } from "@workspace/contracts/instagram/music";
import z from "zod";
import { type ParsedPost, ParsedPostSchema } from "../../base/schemas/post";
import { type ParsedUser, ParsedUserSchema } from "../../base/schemas/user";

export const ParsedInstagramUserSchema = ParsedUserSchema.extend({});

export const InstagramUserTagSchema = z.object({
  x: z.number(),
  y: z.number(),
  user: ParsedInstagramUserSchema,
});

export const ParsedInstagramPostSchema = ParsedPostSchema.extend({
  media: InstagramMediaSchema,
  userTags: z.array(InstagramUserTagSchema),
  location: InstagramLocationSchema.optional(),
  likes: z.number(),
  music: InstagramMusicSchema.optional(),
});

export type ParsedInstagramPost = z.infer<typeof ParsedInstagramPostSchema> & ParsedPost;
export type ParsedInstagramUser = z.infer<typeof ParsedInstagramUserSchema> & ParsedUser;
export type InstagramUserTag = z.infer<typeof InstagramUserTagSchema>;
