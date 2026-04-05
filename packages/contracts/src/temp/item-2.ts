import z from "zod";
import { InstagramMusicSchema, TiktokMusicSchema } from "./common";

const ItemMetadataSchema = z.discriminatedUnion("platform", [
  z.discriminatedUnion("kind", [
    z.object({
      platform: z.literal("instagram"),
      kind: z.literal("creator"),
      username: z.string(),
    }),
    z.object({
      platform: z.literal("instagram"),
      kind: z.literal("post"),
      views: z.number(),
      likes: z.number(),
      music: InstagramMusicSchema.optional(),
    }),
  ]),

  z.discriminatedUnion("kind", [
    z.object({
      platform: z.literal("tiktok"),
      kind: z.literal("creator"),
      username: z.string(),
    }),
    z.object({
      platform: z.literal("tiktok"),
      kind: z.literal("post"),
      views: z.number(),
      likes: z.number(),
      music: TiktokMusicSchema.optional(),
    }),
  ]),
]);

const ItemSchema = z.object({
  platform: z.enum(["tiktok", "instagram"]),
  kind: z.enum(["creator", "post"]),
  id: z.uuid(),
  title: z.string(),
  url: z.url(),
  metadata: ItemMetadataSchema,
});

export type Item2 = z.infer<typeof ItemSchema>;
export type Item2Metadata = Item2["metadata"];
