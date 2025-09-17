import { InstagramLocationSchema } from "@workspace/contracts/instagram/location";
import { InstagramMediaSchema } from "@workspace/contracts/instagram/media";
import { InstagramMusicSchema } from "@workspace/contracts/instagram/music";
import z from "zod";

export const ParsedInstagramUserSchema = z.object({
  userId: z.string(),
  url: z.url(),
  username: z.string(),
  profilePicture: z.string().optional(),
  name: z.string().optional(),
  verified: z.boolean(),
});

export const InstagramUserTagSchema = z.object({
  x: z.number(),
  y: z.number(),
  user: ParsedInstagramUserSchema,
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

export type ParsedInstagramPost = z.infer<typeof ParsedInstagramPostSchema>;
export type ParsedInstagramUser = z.infer<typeof ParsedInstagramUserSchema>;
export type InstagramUserTag = z.infer<typeof InstagramUserTagSchema>;
