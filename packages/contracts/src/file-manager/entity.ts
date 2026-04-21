import z from "zod";
import { FileExtensionEnum, FileTypeEnum, MimeTypeEnum } from "./enum";
import { FileMetadataSchema } from "./metadata";

export const FolderSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  parentId: z.uuid().nullable(),
  createdAt: z.date(),
});

export const FolderTreeSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  parentId: z.uuid().nullable(),
  createdAt: z.date(),
  get children() {
    return z.array(FolderTreeSchema);
  },
});

export const FileSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  mimeType: MimeTypeEnum,
  size: z.number().int().nonnegative(),
  type: FileTypeEnum,
  extension: FileExtensionEnum,
  s3Key: z.string(),
  folderId: z.uuid().nullable(),
  metadata: FileMetadataSchema.nullable(),
  createdAt: z.date(),
});
