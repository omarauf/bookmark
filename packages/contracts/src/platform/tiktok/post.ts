import z from "zod";
import { CreateBasePostSchema } from "../base/post";
import { CreateTiktokCreatorSchema } from "./creator";
import { TiktokMediaSchema } from "./media";
import { TiktokMusicSchema } from "./music";

export const CreateTiktokPostSchema = CreateBasePostSchema.extend({
  media: TiktokMediaSchema.array(),
  likes: z.number(),
  comments: z.number(),
  shares: z.number(),
  plays: z.number(),
  collects: z.number(),
  creator: CreateTiktokCreatorSchema,
  music: TiktokMusicSchema,
  platform: z.literal("tiktok"),
});

export const TiktokMetadataPostSchema = z.object({
  platform: z.literal("tiktok"),
  music: TiktokMusicSchema.optional(),
  likes: z.number(),
  comments: z.number(),
  shares: z.number(),
  plays: z.number(),
  collects: z.number(),
});
