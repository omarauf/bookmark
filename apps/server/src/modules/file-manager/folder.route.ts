import { FolderSchemas } from "@workspace/contracts/file-manager";
import { asc, count, eq, inArray } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { folderRepo } from "./repo";
import { files, folders } from "./schema";
import * as service from "./service";
import * as treeUtils from "./utils/tree";

export const folderRouter = {
  tree: protectedProcedure
    .input(FolderSchemas.tree.request)
    .output(FolderSchemas.tree.response)
    .errors({ NOT_FOUND: { message: "Folder not found" } })
    .handler(async ({ input, errors }) => {
      const parentId = input.parentId;

      if (parentId) {
        const exists = await folderRepo.existsById(parentId);
        if (!exists) throw errors.NOT_FOUND();
      }

      const rows = await db
        .select()
        .from(folders)
        .orderBy(asc(folders.name), asc(folders.createdAt));

      const nodes = treeUtils.folderRowsToNodes(rows);

      if (!parentId) {
        return nodes.filter((node) => node.parentId === null);
      }

      const map = treeUtils.buildMap(nodes);

      return map.get(parentId)?.children ?? [];
    }),

  create: protectedProcedure
    .input(FolderSchemas.create.request)
    .output(FolderSchemas.create.response)
    .errors({
      BAD_REQUEST: { message: "Parent folder not found" },
      CONFLICT: { message: "Folder already exists in this location" },
    })
    .handler(async ({ input, errors }) => {
      const parentId = input.parentId;

      if (parentId) {
        const exists = await folderRepo.existsById(parentId);
        if (!exists) throw errors.BAD_REQUEST();
      }

      const isNameTaken = await service.isFolderNameTaken(parentId, input.name);
      if (isNameTaken) throw errors.CONFLICT();

      await db.insert(folders).values({ name: input.name, parentId });
    }),

  rename: protectedProcedure
    .input(FolderSchemas.rename.request)
    .output(FolderSchemas.rename.response)
    .errors({
      NOT_FOUND: { message: "Folder not found" },
      CONFLICT: { message: "Folder already exists in this location" },
    })
    .handler(async ({ input, errors }) => {
      const folder = await folderRepo.findById(input.id);
      if (!folder) throw errors.NOT_FOUND();

      const conflict = await service.isFolderNameTaken(folder.parentId, input.name, folder.id);
      if (conflict) throw errors.CONFLICT();

      await db.update(folders).set({ name: input.name }).where(eq(folders.id, input.id));
    }),

  move: protectedProcedure
    .input(FolderSchemas.move.request)
    .output(FolderSchemas.move.response)
    .errors({
      NOT_FOUND: { message: "Folder not found" },
      BAD_REQUEST: { message: "Parent folder not found" },
      BAD_REQUEST_CHILD: { message: "You cannot move a folder under its own descendants" },
      CONFLICT: { message: "Folder already exists in this location" },
    })
    .handler(async ({ input, errors }) => {
      const folder = await folderRepo.findById(input.id);
      if (!folder) throw errors.NOT_FOUND();

      const parentId = input.parentId;
      if (parentId === folder.id) throw errors.BAD_REQUEST_CHILD();

      if (parentId) {
        const parent = await folderRepo.findById(parentId);
        if (!parent) throw errors.BAD_REQUEST();

        const descendants = await service.getFolderDescendants(folder.id);
        if (descendants.has(parentId)) throw errors.BAD_REQUEST_CHILD();
      }

      const conflict = await service.isFolderNameTaken(parentId, folder.name, folder.id);
      if (conflict) throw errors.CONFLICT();

      await db.update(folders).set({ parentId }).where(eq(folders.id, input.id));
    }),

  delete: protectedProcedure
    .input(FolderSchemas.delete.request)
    .output(FolderSchemas.delete.response)
    .errors({ NOT_FOUND: { message: "Folder not found" } })
    .handler(async ({ input, errors }) => {
      const folder = await folderRepo.findById(input.id);
      if (!folder) throw errors.NOT_FOUND();

      const allFolderIds = await service.collectFolderDescendants(folder.id);

      const [fileSummary] = await db
        .select({ count: count() })
        .from(files)
        .where(inArray(files.folderId, allFolderIds));

      await db.transaction(async (tx) => {
        await tx.delete(files).where(inArray(files.folderId, allFolderIds));
        await tx.delete(folders).where(inArray(folders.id, allFolderIds));
      });

      return { deletedFolderCount: allFolderIds.length, deletedFileCount: fileSummary.count };
    }),

  breadcrumb: protectedProcedure
    .input(FolderSchemas.breadcrumb.request)
    .output(FolderSchemas.breadcrumb.response)
    .errors({ NOT_FOUND: { message: "Folder not found" } })
    .handler(async ({ input, errors }) => {
      const folder = await folderRepo.findById(input.folderId);
      if (!folder) throw errors.NOT_FOUND();

      const breadcrumb = await service.getFolderBreadcrumb(input.folderId);

      return breadcrumb;
    }),
};
