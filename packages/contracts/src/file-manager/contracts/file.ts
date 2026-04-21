import z from "zod";
import { FileSchema, type FolderSchema } from "../entity";
import { FileExtensionEnum, FileTypeEnum } from "../enum";

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

  stats: {
    response: z.object({
      totalCount: z.number().int(),
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

  upload: {
    request: z.object({
      files: z.file().array().min(1),
      folderId: z.uuid().optional(),
    }),
    response: z.object({
      success: z.string().array(),
      failed: z.string().array(),
    }),
  },
};

export type Folder = z.infer<typeof FolderSchema>;
export type File = z.infer<typeof FileSchema>;
export type BrowseItem = (Folder & { type: "folder" }) | File;

export type FolderTree = z.infer<typeof FolderSchema> & {
  children: FolderTree[];
};
