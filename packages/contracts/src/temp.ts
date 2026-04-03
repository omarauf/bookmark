import z from "zod";

const ItemMetadataSchema = z.discriminatedUnion("platform", [
  z.discriminatedUnion("type", [
    z.object({
      platform: z.literal("twitter"),
      type: z.literal("creator"),
      username: z.string(),
    }),
    z.object({
      platform: z.literal("twitter"),
      type: z.literal("post"),
      views: z.number(),
      likes: z.number(),
    }),
  ]),

  z.discriminatedUnion("type", [
    z.object({
      platform: z.literal("facebook"),
      type: z.literal("creator"),
      username: z.string(),
    }),
    z.object({
      platform: z.literal("facebook"),
      type: z.literal("post"),
      views: z.number(),
      likes: z.number(),
    }),
  ]),
]);

const ItemMetadataSchema2 = z.discriminatedUnion("type", [
  z.object({
    platform: z.enum(["twitter", "facebook"]),
    type: z.literal("creator"),
    username: z.string(),
  }),

  z.discriminatedUnion("platform", [
    z.object({
      platform: z.literal("twitter"),
      type: z.literal("post"),
      views: z.number(),
      likes: z.number(),
      quotes: z.number(),
    }),
    z.object({
      platform: z.literal("facebook"),
      type: z.literal("post"),
      views: z.number(),
      likes: z.number(),
    }),
  ]),
]);
