import { z } from "zod";

const ImageMetadataSchema = z.object({
  type: z.literal("image"),
  width: z.number(),
  height: z.number(),
  format: z.string().optional(),
});

const VideoMetadataSchema = z.object({
  type: z.literal("video"),
  duration: z.number(), // seconds
  width: z.number().optional(),
  height: z.number().optional(),
  codec: z.string().optional(),
  fps: z.number().optional(),
});

const AudioMetadataSchema = z.object({
  type: z.literal("audio"),
  duration: z.number(), // seconds
  bitrate: z.number().optional(),
  codec: z.string().optional(),
});

const PdfMetadataSchema = z.object({
  type: z.literal("pdf"),
  pages: z.number(),
  author: z.string().optional(),
});

// export const OtherMetadataSchema = z.object({
//   type: z.literal("other"),
//   data: z.record(z.any()).optional(),
// });

export const FileMetadataSchema = z.discriminatedUnion("type", [
  ImageMetadataSchema,
  VideoMetadataSchema,
  AudioMetadataSchema,
  PdfMetadataSchema,
]);

export type FileMetadata = z.infer<typeof FileMetadataSchema>;
