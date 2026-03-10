import { TiktokImageMediaSchema, TiktokVideoMediaSchema } from "@workspace/contracts/tiktok/media";
import { TiktokMusicSchema } from "@workspace/contracts/tiktok/music";
import z from "zod";
import { type ParsedPost, ParsedPostSchema } from "../../base/schemas/post";
import { type ParsedUser, ParsedUserSchema } from "../../base/schemas/user";

const ParsedTiktokUserSchema = ParsedUserSchema.extend({
  location: z.string().optional(),
});

export const ParsedTiktokPostSchema = ParsedPostSchema.extend({
  creator: ParsedTiktokUserSchema,
  media: z
    .discriminatedUnion("mediaType", [TiktokImageMediaSchema, TiktokVideoMediaSchema])
    .array(),
  music: TiktokMusicSchema,
  collects: z.number(),
  comments: z.number(),
  likes: z.number(),
  plays: z.number(),
  shares: z.number(),
});

export type ParsedTiktokUser = z.infer<typeof ParsedTiktokUserSchema> & ParsedUser;
export type ParsedTiktokPost = z.infer<typeof ParsedTiktokPostSchema> & ParsedPost;
