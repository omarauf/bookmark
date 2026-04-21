import z from "zod";
import { FolderTreeSchema } from "../entity";

export const FolderSchemas = {
  tree: {
    request: z.object({
      parentId: z.uuid().optional(),
    }),
    response: FolderTreeSchema.array(),
  },

  create: {
    request: z.object({
      name: z.string().min(1),
      parentId: z.uuid().optional(),
    }),
    response: z.void(),
  },

  rename: {
    request: z.object({
      id: z.uuid(),
      name: z.string().min(1),
    }),
    response: z.void(),
  },

  move: {
    request: z.object({
      id: z.uuid(),
      parentId: z.uuid().optional(),
    }),
    response: z.void(),
  },

  delete: {
    request: z.object({ id: z.uuid() }),
    response: z.object({
      deletedFolderCount: z.number().int(),
      deletedFileCount: z.number().int(),
    }),
  },

  breadcrumb: {
    request: z.object({ folderId: z.uuid() }),
    response: z.object({ value: z.uuid(), label: z.string() }).array(),
  },
};

export type CreateFolder = z.infer<typeof FolderSchemas.create.request>;
export type RenameFolder = z.infer<typeof FolderSchemas.rename.request>;
export type MoveFolder = z.infer<typeof FolderSchemas.move.request>;
export type BreadcrumbFolder = z.infer<typeof FolderSchemas.breadcrumb.response>;
