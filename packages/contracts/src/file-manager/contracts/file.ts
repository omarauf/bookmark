import z from "zod";
import { FileSchema, type FolderSchema } from "../entity";
import { FileExtensionEnum, FileTypeEnum, MimeTypeEnum } from "../enum";
import { FileMetadataSchema } from "../metadata";

export const FileSchemas = {
  fileList: {
    request: z.object({
      folderId: z.uuid().optional(),
      type: FileTypeEnum.optional(),
      query: z.string().trim().optional(),
    }),
    response: FileSchema.array(),
  },

  get: {
    request: z.object({ id: z.uuid() }),
    response: FileSchema,
  },

  create: {
    request: z.object({
      name: z.string().min(1),
      mimeType: MimeTypeEnum,
      size: z.number().int().nonnegative(),
      type: FileTypeEnum,
      extension: FileExtensionEnum,
      folderId: z.uuid().optional(),
      metadata: FileMetadataSchema.optional(),
      s3Key: z.string().optional(),
    }),
    response: FileSchema,
  },

  rename: {
    request: z.object({
      id: z.uuid(),
      name: z.string().min(1),
    }),
    response: FileSchema,
  },

  move: {
    request: z.object({
      id: z.uuid(),
      folderId: z.uuid().optional(),
    }),
    response: FileSchema,
  },

  delete: {
    request: z.object({ id: z.uuid() }),
    response: FileSchema,
  },

  bulkDelete: {
    request: z.object({ ids: z.array(z.uuid()).min(1) }),
    response: z.object({ count: z.number().int() }),
  },

  restore: {
    request: z.object({ id: z.uuid() }),
    response: FileSchema,
  },

  permanentDelete: {
    request: z.object({ id: z.uuid() }),
    response: FileSchema,
  },

  trash: {
    response: FileSchema.array(),
  },

  recent: {
    response: FileSchema.array(),
  },

  stats: {
    response: z.object({
      totalCount: z.number().int(),
      activeCount: z.number().int(),
      deletedCount: z.number().int(),
      totalSize: z.number().int(),
      byType: z.array(
        z.object({
          type: FileTypeEnum,
          count: z.number().int(),
          size: z.number().int(),
        }),
      ),
      byExtension: z.array(
        z.object({
          extension: FileExtensionEnum,
          count: z.number().int(),
        }),
      ),
    }),
  },

  download: {
    request: z.object({ id: z.uuid() }),
    response: z.object({
      s3Key: z.string(),
      downloadUrl: z.string().optional(),
    }),
  },

  preview: {
    request: z.object({ id: z.uuid() }),
    response: z.object({
      s3Key: z.string(),
      downloadUrl: z.string().optional(),
    }),
  },
};

export type Folder = z.infer<typeof FolderSchema>;
export type File = z.infer<typeof FileSchema>;
export type BrowseItem = (Folder & { type: "folder" }) | File;

export type FolderTree = z.infer<typeof FolderSchema> & {
  children: FolderTree[];
};
