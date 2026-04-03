import z from "zod";
import { CreatorSchema } from "../creator/entity";
import { NormalizedMediaSchema } from "../media";
import { BasePostSchema, CreateBasePostSchema } from "../platform/base/post";
import { InstagramMetadataPostSchema } from "../platform/instagram/post";
import { TiktokMetadataPostSchema } from "../platform/tiktok/post";
import { TwitterMetadataPostSchema } from "../platform/twitter/post";

export const PostSchema = BasePostSchema.extend({
  creator: CreatorSchema,
  media: NormalizedMediaSchema.array(),
  metadata: z.discriminatedUnion("platform", [
    InstagramMetadataPostSchema,
    TwitterMetadataPostSchema,
    TiktokMetadataPostSchema,
  ]),
});

// export const PostSchema = z.discriminatedUnion("platform", [
//   BasePostSchema.extend({
//     platform: z.literal("instagram"),
//     creator: InstagramCreatorSchema,
//     metadata: InstagramMetadataPostSchema,
//     media: NormalizedMediaSchema.array(),
//   }),
//   BasePostSchema.extend({
//     platform: z.literal("twitter"),
//     creator: TwitterCreatorSchema,
//     metadata: TwitterMetadataPostSchema,
//     media: NormalizedMediaSchema.array(),
//   }),
//   BasePostSchema.extend({
//     platform: z.literal("tiktok"),
//     creator: TiktokCreatorSchema,
//     metadata: TiktokMetadataPostSchema,
//     media: NormalizedMediaSchema.array(),
//   }),
// ]);

export const CreatePostSchema = CreateBasePostSchema.extend({
  metadata: z.discriminatedUnion("platform", [
    InstagramMetadataPostSchema,
    TwitterMetadataPostSchema,
    TiktokMetadataPostSchema,
  ]),
});
