import { z } from "zod";
import { ChromeLinkMetadataSchema } from "../../platforms/chrome";
import { MovieMetadataSchema } from "../../platforms/imdb/movie";
import { TvMetadataSchema } from "../../platforms/imdb/tv";
import { InstagramMetadataCreatorSchema } from "../../platforms/instagram/creator";
import { InstagramMetadataPostSchema } from "../../platforms/instagram/post";
import { TiktokMetadataCreatorSchema } from "../../platforms/tiktok/creator";
import { TiktokMetadataPostSchema } from "../../platforms/tiktok/post";
import { TwitterMetadataCreatorSchema } from "../../platforms/twitter/creator";
import { TwitterMetadataPostSchema } from "../../platforms/twitter/post";

export const ItemMetadataSchema = z.discriminatedUnion("platform", [
  z.discriminatedUnion("kind", [InstagramMetadataCreatorSchema, InstagramMetadataPostSchema]),

  z.discriminatedUnion("kind", [TiktokMetadataCreatorSchema, TiktokMetadataPostSchema]),

  z.discriminatedUnion("kind", [TwitterMetadataCreatorSchema, TwitterMetadataPostSchema]),

  z.discriminatedUnion("kind", [ChromeLinkMetadataSchema]),

  z.discriminatedUnion("kind", [MovieMetadataSchema, TvMetadataSchema]),
]);
