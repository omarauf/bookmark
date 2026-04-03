import z from "zod";

const TiktokVideoMediaSchema = z.object({
  mediaType: z.literal("video"),
  url: z.string(),
  thumbnail: z.string(),
  duration: z.number(),
  width: z.number(),
  height: z.number(),
});

const TiktokImageMediaSchema = z.object({
  mediaType: z.literal("image"),
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

export const TiktokMediaSchema = z.discriminatedUnion("mediaType", [
  TiktokVideoMediaSchema,
  TiktokImageMediaSchema,
]);
