import z from "zod";
import { AnimeSchema } from "../anime";
import { MovieSchema, TvSchema } from "../imdb";
import { LinkSchema } from "../link/entity";
import { InstagramSchema, TiktokSchema, TwitterSchema } from "../post/entity";
import { ProfileSchema } from "../profile";
import { YoutubeSchema } from "../youtube";

export const ItemViewSchema = z.discriminatedUnion("kind", [
  z.discriminatedUnion("platform", [InstagramSchema, TiktokSchema, TwitterSchema]),

  ProfileSchema,

  LinkSchema,

  MovieSchema,

  TvSchema,

  AnimeSchema,

  YoutubeSchema,
]);

export type ItemView = z.infer<typeof ItemViewSchema>;
