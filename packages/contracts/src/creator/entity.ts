import z from "zod";
import { BaseCreatorSchema, CreateBaseCreatorSchema } from "../platform/base/creator";
import { InstagramMetadataCreatorSchema } from "../platform/instagram/creator";
import { TiktokMetadataCreatorSchema } from "../platform/tiktok/creator";
import { TwitterMetadataCreatorSchema } from "../platform/twitter/creator";

export const CreatorSchema = BaseCreatorSchema.extend({
  metadata: z.discriminatedUnion("platform", [
    InstagramMetadataCreatorSchema,
    TwitterMetadataCreatorSchema,
    TiktokMetadataCreatorSchema,
  ]),
});

export const CreateCreatorSchema = CreateBaseCreatorSchema.extend({
  metadata: z.discriminatedUnion("platform", [
    InstagramMetadataCreatorSchema,
    TwitterMetadataCreatorSchema,
    TiktokMetadataCreatorSchema,
  ]),
});
