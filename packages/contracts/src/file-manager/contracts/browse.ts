import z from "zod";
import { FileSchema, FolderSchema } from "../entity";

export const BrowseSchemas = {
  all: {
    response: z.object({
      folders: FolderSchema.array(),
      files: FileSchema.array(),
    }),
  },

  list: {
    request: z.object({
      parentId: z.uuid().optional(),
    }),
    response: z.object({
      folder: FolderSchema.optional(),
      folders: FolderSchema.array(),
      files: FileSchema.array(),
    }),
  },

  search: {
    request: z.object({ query: z.string().trim().min(1) }),
    response: z.object({
      folders: FolderSchema.array(),
      files: FileSchema.array(),
    }),
  },

  move: {
    request: z.object({
      itemIds: z.uuid().array(),
      sourceFolderId: z.uuid().optional(),
      targetFolderId: z.uuid().optional(),
    }),
    response: z.object({
      movedFiles: z.number().int(),
      movedFolders: z.number().int(),
    }),
  },
};
