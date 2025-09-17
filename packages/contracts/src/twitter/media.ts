import z from "zod";

export const TwitterVideoMediaSchema = z.object({
  mediaType: z.literal("video"),
  url: z.string(),
  thumbnail: z.string(),
  duration: z.number(),
  width: z.number(),
  height: z.number(),
});

export const TwitterImageMediaSchema = z.object({
  mediaType: z.literal("image"),
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

export const TwitterGifMediaSchema = z.object({
  mediaType: z.literal("gif"),
  url: z.string(),
  thumbnail: z.string(),
  duration: z.number(),
  width: z.number(),
  height: z.number(),
});
