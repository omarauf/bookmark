import z from "zod";
import { AnimeSchema } from "../anime";
import { MovieSchema, TvSchema } from "../imdb";
import { LinkSchema } from "../link/entity";
import { InstagramSchema, TiktokSchema, TwitterSchema } from "../post/entity";
import { ProfileSchema } from "../profile";
import { YoutubeSchema } from "../youtube";

export const ItemViewSchema = z.discriminatedUnion("platform", [
  z.discriminatedUnion("kind", [ProfileSchema, InstagramSchema]),

  z.discriminatedUnion("kind", [ProfileSchema, TiktokSchema]),

  z.discriminatedUnion("kind", [ProfileSchema, TwitterSchema]),

  z.discriminatedUnion("kind", [LinkSchema]),

  z.discriminatedUnion("kind", [MovieSchema, TvSchema]),

  z.discriminatedUnion("kind", [AnimeSchema]),

  z.discriminatedUnion("kind", [YoutubeSchema]),
]);

export type ItemView = z.infer<typeof ItemViewSchema>;
