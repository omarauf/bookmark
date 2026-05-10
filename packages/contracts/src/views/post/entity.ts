import { z } from "zod";
import { CollectionSummarySchema } from "../../core/collection/entity";
import { ItemBaseViewSchema } from "../../core/item/entity";
import { NormalizedMediaSchema } from "../../core/media";
import { TagSchema } from "../../core/tag";
import { InstagramMetadataPostSchema } from "../../platforms/instagram/post";
import { TiktokMetadataPostSchema } from "../../platforms/tiktok/post";
import { TwitterMetadataPostSchema } from "../../platforms/twitter/post";
import { ProfileSchema } from "../profile";

const BasePostSchema = ItemBaseViewSchema.extend({
  media: NormalizedMediaSchema.array(),
  creator: ProfileSchema,
  taggedItems: ProfileSchema.extend({ x: z.number(), y: z.number() }).array(),
  collections: CollectionSummarySchema.array(),
  tags: TagSchema.array(),
});

export const InstagramSchema = BasePostSchema.extend({ ...InstagramMetadataPostSchema.shape });
export const TiktokSchema = BasePostSchema.extend({ ...TiktokMetadataPostSchema.shape });
export const TwitterSchema = BasePostSchema.extend({ ...TwitterMetadataPostSchema.shape });

export const PostSchema = z.discriminatedUnion("platform", [
  InstagramSchema,
  TiktokSchema,
  TwitterSchema,
]);
