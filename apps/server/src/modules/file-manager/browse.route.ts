import { BrowseSchemas } from "@workspace/contracts/file-manager";
import { asc, count, desc, eq, ilike, inArray, isNull, or } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { moveHandler } from "./handler/move";
import { folderRepo } from "./repo";
import { files, folders } from "./schema";
import * as service from "./service";

export const browseRouter = {
  all: protectedProcedure.output(BrowseSchemas.all.response).handler(async () => {
    const [folderRows, fileRows] = await Promise.all([
      db.select().from(folders).orderBy(asc(folders.name), asc(folders.createdAt)),
      db.select().from(files).orderBy(desc(files.createdAt), asc(files.name)),
    ]);

    return {
      folders: folderRows,
      files: fileRows,
    };
  }),

  list: protectedProcedure
    .input(BrowseSchemas.list.request)
    .output(BrowseSchemas.list.response)
    .errors({ NOT_FOUND: { message: "Folder not found" } })
    .handler(async ({ input, errors }) => {
      const parentId = input.parentId;

      const folder = parentId ? await folderRepo.findById(parentId) : undefined;

      if (parentId && !folder) throw errors.NOT_FOUND();

      const [childFolders, childFiles] = await Promise.all([
        db
          .select()
          .from(folders)
          .where(parentId ? eq(folders.parentId, parentId) : isNull(folders.parentId))
          .orderBy(asc(folders.name), asc(folders.createdAt)),
        db
          .select()
          .from(files)
          .where(parentId ? eq(files.folderId, parentId) : isNull(files.folderId))
          .orderBy(desc(files.createdAt), asc(files.name)),
      ]);

      return {
        folder: folder,
        folders: childFolders,
        files: childFiles,
      };
    }),

  search: protectedProcedure
    .input(BrowseSchemas.search.request)
    .output(BrowseSchemas.search.response)
    .handler(async ({ input }) => {
      const query = `%${input.query}%`;

      const [matchedFolders, matchedFiles] = await Promise.all([
        db
          .select()
          .from(folders)
          .where(ilike(folders.name, query))
          .orderBy(asc(folders.name), asc(folders.createdAt)),
        db
          .select()
          .from(files)
          .where(ilike(files.name, query))
          .orderBy(desc(files.createdAt), asc(files.name)),
      ]);

      return {
        folders: matchedFolders,
        files: matchedFiles,
      };
    }),

  move: moveHandler,

  delete: protectedProcedure
    .input(BrowseSchemas.delete.request)
    .output(BrowseSchemas.delete.response)
    .handler(async ({ input }) => {
      if (input.length === 0) return { deletedFolders: 0, deletedFiles: 0 };

      const folderItems = input.filter((item) => item.type === "folder");
      const fileItems = input.filter((item) => item.type === "file");

      const folderIds = folderItems.map((item) => item.itemId);
      const fileIds = fileItems.map((item) => item.itemId);

      const allFolderIdsSet = new Set<string>();

      for (const folderId of folderIds) {
        const descendants = await service.collectFolderDescendants(folderId);
        for (const id of descendants) {
          allFolderIdsSet.add(id);
        }
      }

      const allFolderIds = [...allFolderIdsSet];

      const fileCount =
        allFolderIds.length > 0
          ? await db
              .select({ count: count() })
              .from(files)
              .where(or(inArray(files.folderId, allFolderIds), inArray(files.id, fileIds)))
              .then((r) => r[0]?.count ?? 0)
          : fileIds.length > 0
            ? await db
                .select({ count: count() })
                .from(files)
                .where(inArray(files.id, fileIds))
                .then((r) => r[0]?.count ?? 0)
            : 0;

      await db.transaction(async (tx) => {
        if (allFolderIds.length > 0 && fileIds.length > 0) {
          await tx
            .delete(files)
            .where(or(inArray(files.folderId, allFolderIds), inArray(files.id, fileIds)));
        } else if (allFolderIds.length > 0) {
          await tx.delete(files).where(inArray(files.folderId, allFolderIds));
        } else if (fileIds.length > 0) {
          await tx.delete(files).where(inArray(files.id, fileIds));
        }

        if (allFolderIds.length > 0) {
          await tx.delete(folders).where(inArray(folders.id, allFolderIds));
        }
      });

      return {
        deletedFolders: allFolderIds.length,
        deletedFiles: fileCount,
      };
    }),
};
