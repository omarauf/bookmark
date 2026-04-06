import z from "zod";
import { PlatformEnum } from "../common/platform";
import { MediaTypeEnum, MimeTypeEnum } from "./enum";

export const MediaSchema = z.object({
  id: z.uuid(), // unique identifier for the media
  itemId: z.uuid(), // reference to the associated reference entity (e.g., post or creator)
  url: z.string(), // external URL of the media file
  platform: PlatformEnum, // platform where the media is hosted (e.g., "twitter", "youtube")
  type: MediaTypeEnum, // type of media (e.g., "image", "video")
  width: z.number(), // width of the media in pixels
  height: z.number(), // height of the media in pixels
  mime: MimeTypeEnum, // MIME type of the media (e.g., "image/jpeg", "video/mp4")
  size: z.number(), // size of the media file in bytes
  placeholder: z.string(), // placeholder base64 string for the media (e.g., a blurred version of the image)
  duration: z.number().optional(), // duration of the media in seconds (only applicable for videos)
  key: z.string(), // storage key for the media file in the storage service
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
