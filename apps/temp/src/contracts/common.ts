import z from "zod";

export const PlatformEnum = z.enum(["instagram", "tiktok", "twitter"]);
export type Platform = z.infer<typeof PlatformEnum>;
export const PlatformValues = PlatformEnum.options as [Platform, ...Platform[]];

export const KindEnum = z.enum(["post", "profile"]);
export type Kind = z.infer<typeof KindEnum>;
export const KindValues = KindEnum.options as [Kind, ...Kind[]];

export const DownloadStatusEnum = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
  "exists",
]);
export type DownloadStatus = z.infer<typeof DownloadStatusEnum>;
export const DownloadStatusValues = DownloadStatusEnum.options as [
  DownloadStatus,
  ...DownloadStatus[],
];

export const DownloadTargetEnum = z.enum(["post", "creator"]);
export type DownloadTarget = z.infer<typeof DownloadTargetEnum>;
export const DownloadTargetValues = DownloadTargetEnum.options as [
  DownloadTarget,
  ...DownloadTarget[],
];

export const RelationEnum = z.enum(["created_by", "mentions", "related", "tagged", "quoted"]);
export type Relation = z.infer<typeof RelationEnum>;
export const RelationValues = RelationEnum.options as [Relation, ...Relation[]];

export const MediaTypeEnum = z.enum(["image", "video"]);
export type MediaType = z.infer<typeof MediaTypeEnum>;
export const MediaTypeValues = MediaTypeEnum.options as [MediaType, ...MediaType[]];

export const MimeTypeEnum = z.enum(["image/jpeg", "image/png", "video/mp4", "image/webp"]);
export type MimeType = z.infer<typeof MimeTypeEnum>;
export const MimeTypeValues = MimeTypeEnum.options as [MimeType, ...MimeType[]];
