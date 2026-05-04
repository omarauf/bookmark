import { z } from "zod";

export const FileTypeEnum = z.enum([
  "image",
  "video",
  "audio",
  "pdf",
  "document",
  "archive",
  "text",
  "other",
]);
export type FileType = z.infer<typeof FileTypeEnum>;
export const FileTypeValues = FileTypeEnum.options as [FileType, ...FileType[]];

export const MimeTypeEnum = z.enum([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/heic",

  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-matroska",

  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/webm",

  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",

  "text/plain",
  "text/csv",
  "application/json",
]);
export type MimeType = z.infer<typeof MimeTypeEnum>;
export const MimeTypeValues = MimeTypeEnum.options as [MimeType, ...MimeType[]];

export const FileExtensionEnum = z.enum([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "svg",
  "heic",

  "mp4",
  "webm",
  "mov",
  "mkv",

  "mp3",
  "wav",
  "ogg",

  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",

  "zip",
  "rar",
  "7z",

  "txt",
  "csv",
  "json",
]);
export type FileExtension = z.infer<typeof FileExtensionEnum>;
export const FileExtensionValues = FileExtensionEnum.options as [FileExtension, ...FileExtension[]];

export const MimeToFileTypeMap: Record<MimeType, FileType> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "image/svg+xml": "image",
  "image/heic": "image",

  "video/mp4": "video",
  "video/webm": "video",
  "video/quicktime": "video",
  "video/x-matroska": "video",

  "audio/mpeg": "audio",
  "audio/wav": "audio",
  "audio/ogg": "audio",
  "audio/webm": "audio",

  "application/pdf": "pdf",
  "application/msword": "document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "document",
  "application/vnd.ms-excel": "document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "document",

  "application/zip": "archive",
  "application/x-rar-compressed": "archive",
  "application/x-7z-compressed": "archive",

  "text/plain": "text",
  "text/csv": "text",
  "application/json": "text",
};
