import { z } from "zod";
import { PlatformEnum } from "../../foundation/platform";
import { MediaTypeEnum, MimeTypeEnum } from "./enum";

export const MediaSchema = z.object({
  id: z.uuid(),
  itemId: z.uuid(),
  url: z.string(),
  platform: PlatformEnum,
  type: MediaTypeEnum,
  width: z.number(),
  height: z.number(),
  mime: MimeTypeEnum,
  size: z.number(),
  placeholder: z.string(),
  duration: z.number().optional(),
  key: z.string(),
  createdAt: z.date(),
});

export type Media = z.infer<typeof MediaSchema>;

export const ImageMediaSchema = z.object({
  type: z.literal("image"),
  key: z.string(),
  width: z.number(),
  height: z.number(),
});

export const VideoMediaSchema = z.object({
  type: z.literal("video"),
  key: z.string(),
  thumbnail: z.string(),
  duration: z.number(),
  width: z.number(),
  height: z.number(),
});

export const NormalizedMediaSchema = z.discriminatedUnion("type", [
  ImageMediaSchema,
  VideoMediaSchema,
]);

export type NormalizedMedia = z.infer<typeof NormalizedMediaSchema>;
