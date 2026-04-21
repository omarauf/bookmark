import z from "zod";

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
  // 🖼️ Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/heic",

  // 🎬 Video
  "video/mp4",
  "video/webm",
  "video/quicktime", // .mov
  "video/x-matroska", // .mkv

  // 🎵 Audio
  "audio/mpeg", // mp3
  "audio/wav",
  "audio/ogg",
  "audio/webm",

  // 📄 Documents
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx

  // 🗜️ Archives
  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",

  // 📜 Text
  "text/plain",
  "text/csv",
  "application/json",
]);
export type MimeType = z.infer<typeof MimeTypeEnum>;
export const MimeTypeValues = MimeTypeEnum.options as [MimeType, ...MimeType[]];

export const FileExtensionEnum = z.enum([
  // 🖼️ Images
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "svg",
  "heic",

  // 🎬 Video
  "mp4",
  "webm",
  "mov",
  "mkv",

  // 🎵 Audio
  "mp3",
  "wav",
  "ogg",

  // 📄 Documents
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",

  // 🗜️ Archives
  "zip",
  "rar",
  "7z",

  // 📜 Text
  "txt",
  "csv",
  "json",
]);
export type FileExtension = z.infer<typeof FileExtensionEnum>;
export const FileExtensionValues = FileExtensionEnum.options as [FileExtension, ...FileExtension[]];

export const MimeToFileTypeMap: Record<MimeType, FileType> = {
  // 🖼️ Images
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "image/svg+xml": "image",
  "image/heic": "image",

  // 🎬 Video
  "video/mp4": "video",
  "video/webm": "video",
  "video/quicktime": "video",
  "video/x-matroska": "video",

  // 🎵 Audio
  "audio/mpeg": "audio",
  "audio/wav": "audio",
  "audio/ogg": "audio",
  "audio/webm": "audio",

  // 📄 Documents
  "application/pdf": "pdf",
  "application/msword": "document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "document",
  "application/vnd.ms-excel": "document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "document",

  // 🗜️ Archives
  "application/zip": "archive",
  "application/x-rar-compressed": "archive",
  "application/x-7z-compressed": "archive",

  // 📜 Text
  "text/plain": "text",
  "text/csv": "text",
  "application/json": "text",
};
