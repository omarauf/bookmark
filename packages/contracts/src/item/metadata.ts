import z from "zod";
import { InstagramMetadataCreatorSchema } from "../platform/instagram/creator";
import { InstagramMetadataPostSchema } from "../platform/instagram/post";
import { TiktokMetadataCreatorSchema } from "../platform/tiktok/creator";
import { TiktokMetadataPostSchema } from "../platform/tiktok/post";
import { TwitterMetadataCreatorSchema } from "../platform/twitter/creator";
import { TwitterMetadataPostSchema } from "../platform/twitter/post";

export const ItemMetadataSchema = z.discriminatedUnion("platform", [
  z.discriminatedUnion("kind", [InstagramMetadataCreatorSchema, InstagramMetadataPostSchema]),

  z.discriminatedUnion("kind", [TiktokMetadataCreatorSchema, TiktokMetadataPostSchema]),

  z.discriminatedUnion("kind", [TwitterMetadataCreatorSchema, TwitterMetadataPostSchema]),
]);
