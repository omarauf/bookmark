import { z } from "zod";

// Media Schemas
export const InstagramImageMediaSchema = z.object({
  mediaType: z.literal("image"),
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

export const InstagramVideoMediaSchema = z.object({
  mediaType: z.literal("video"),
  url: z.string(),
  thumbnail: z.string(),
  duration: z.number(),
  width: z.number(),
  height: z.number(),
  playCount: z.number(),
  viewCount: z.number(),
});

export const InstagramCarouselMediaSchema = z.object({
  mediaType: z.literal("carousel"),
  media: z.array(
    z.discriminatedUnion("mediaType", [InstagramImageMediaSchema, InstagramVideoMediaSchema]),
  ),
});

export type CreateInstagramMedia = z.infer<
  | typeof InstagramImageMediaSchema
  | typeof InstagramVideoMediaSchema
  | typeof InstagramCarouselMediaSchema
>;

export const InstagramMediaSchema = z.discriminatedUnion("mediaType", [
  InstagramImageMediaSchema,
  InstagramVideoMediaSchema,
  InstagramCarouselMediaSchema,
]);

export type InstagramMedia = z.infer<typeof InstagramMediaSchema>;
export type InstagramImageMedia = z.infer<typeof InstagramImageMediaSchema>;
export type InstagramVideoMedia = z.infer<typeof InstagramVideoMediaSchema>;
export type InstagramCarouselMedia = z.infer<typeof InstagramCarouselMediaSchema>;
