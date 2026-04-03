import z from "zod";

export const MediaTypeEnum = z.enum(["image", "video"]);
export type MediaType = z.infer<typeof MediaTypeEnum>;
export const MediaTypeValues = MediaTypeEnum.options as [MediaType, ...MediaType[]];

export const MimeTypeEnum = z.enum(["image/jpeg", "image/png", "video/mp4", "image/webp"]);
export type MimeType = z.infer<typeof MimeTypeEnum>;
export const MimeTypeValues = MimeTypeEnum.options as [MimeType, ...MimeType[]];

export const ReferenceTypeEnum = z.enum(["post", "creator"]);
export type ReferenceType = z.infer<typeof ReferenceTypeEnum>;
export const ReferenceTypeValues = ReferenceTypeEnum.options as [ReferenceType, ...ReferenceType[]];
