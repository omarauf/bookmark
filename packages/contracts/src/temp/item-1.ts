import z from "zod";
import { InstagramMusicSchema, TiktokMusicSchema } from "./common";

const CommonSchema = z.object({
  platform: z.enum(["tiktok", "instagram"]),
  kind: z.enum(["creator", "post"]),
  id: z.uuid(),
  title: z.string(),
  url: z.url(),
});

const ItemSchema = z.discriminatedUnion("platform", [
  z.discriminatedUnion("kind", [
    CommonSchema.extend({
      platform: z.literal("tiktok"),
      kind: z.literal("creator"),
      metadata: z.object({
        username: z.string(),
      }),
    }),
    CommonSchema.extend({
      platform: z.literal("tiktok"),
      kind: z.literal("post"),
      metadata: z.object({
        views: z.number(),
        likes: z.number(),
        music: TiktokMusicSchema.optional(),
      }),
    }),
  ]),

  z.discriminatedUnion("kind", [
    CommonSchema.extend({
      platform: z.literal("instagram"),
      kind: z.literal("creator"),
      metadata: z.object({
        username: z.string(),
      }),
    }),
    CommonSchema.extend({
      platform: z.literal("instagram"),
      kind: z.literal("post"),
      metadata: z.object({
        views: z.number(),
        likes: z.number(),
        music: InstagramMusicSchema.optional(),
      }),
    }),
  ]),
]);

export type Item1 = z.infer<typeof ItemSchema>;
export type Item1Metadata = Item1["metadata"];
