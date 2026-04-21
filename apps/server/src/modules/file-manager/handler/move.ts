import { BrowseSchemas } from "@workspace/contracts/file-manager";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { folderRepo } from "../repo";
import { files, folders } from "../schema";

export const moveHandler = protectedProcedure
  .input(BrowseSchemas.move.request)
  .output(BrowseSchemas.move.response)
  .errors({
    NOT_FOUND: { message: "One or more items not found in source folder" },
    BAD_REQUEST: { message: "Target folder not found" },
    BAD_REQUEST_CYCLE: { message: "Cannot move a folder into its own descendants" },
  })
  .handler(async ({ input, errors }) => {
    const { itemIds, sourceFolderId, targetFolderId } = input;

    if (itemIds.length === 0) return { movedFiles: 0, movedFolders: 0 };
    if (sourceFolderId === targetFolderId) return { movedFiles: 0, movedFolders: 0 };

    const targetParentId = targetFolderId ?? null;

    const sourceFolderWhere = sourceFolderId
      ? eq(folders.parentId, sourceFolderId)
      : isNull(folders.parentId);
    const sourceFileWhere = sourceFolderId
      ? eq(files.folderId, sourceFolderId)
      : isNull(files.folderId);
    const targetFolderWhere = targetFolderId
      ? eq(folders.parentId, targetFolderId)
      : isNull(folders.parentId);
    const targetFileWhere = targetFolderId
      ? eq(files.folderId, targetFolderId)
      : isNull(files.folderId);

    const [
      targetExists,
      matchedFolders,
      matchedFiles,
      existingFolderNames,
      existingFileNames,
      allFolders,
    ] = await Promise.all([
      targetFolderId ? folderRepo.existsById(targetFolderId) : Promise.resolve(true),
      db
        .select({ id: folders.id, name: folders.name })
        .from(folders)
        .where(and(inArray(folders.id, itemIds), sourceFolderWhere)),
      db
        .select({ id: files.id, name: files.name })
        .from(files)
        .where(and(inArray(files.id, itemIds), sourceFileWhere)),
      db.select({ name: folders.name }).from(folders).where(targetFolderWhere),
      db.select({ name: files.name }).from(files).where(targetFileWhere),
      db.select({ id: folders.id, parentId: folders.parentId }).from(folders),
    ]);

    if (!targetExists) throw errors.BAD_REQUEST();

    const foundIds = new Set([
      ...matchedFolders.map((f) => f.id),
      ...matchedFiles.map((f) => f.id),
    ]);

    if (foundIds.size !== itemIds.length) throw errors.NOT_FOUND();

    if (matchedFolders.length > 0 && targetFolderId) {
      const childrenByParent = new Map<string | null, string[]>();
      for (const folder of allFolders) {
        const key = folder.parentId ?? null;
        const bucket = childrenByParent.get(key) ?? [];
        bucket.push(folder.id);
        childrenByParent.set(key, bucket);
      }

      const hasCycle = checkCycleForFolders(
        childrenByParent,
        matchedFolders.map((f) => f.id),
        targetFolderId,
      );

      if (hasCycle) throw errors.BAD_REQUEST_CYCLE();
    }

    const existingFolderNameSet = new Set(existingFolderNames.map((f) => f.name));
    const existingFileNameSet = new Set(existingFileNames.map((f) => f.name));

    const folderRenames = resolveUniqueFolderNames(existingFolderNameSet, matchedFolders);
    const fileRenames = resolveUniqueFileNames(existingFileNameSet, matchedFiles);

    await db.transaction(async (tx) => {
      const folderUpdates = matchedFolders.map((folder) => {
        const newName = folderRenames.get(folder.id);
        return tx
          .update(folders)
          .set({ parentId: targetParentId, ...(newName ? { name: newName } : {}) })
          .where(eq(folders.id, folder.id));
      });

      const fileUpdates = matchedFiles.map((file) => {
        const newName = fileRenames.get(file.id);
        return tx
          .update(files)
          .set({ folderId: targetParentId, ...(newName ? { name: newName } : {}) })
          .where(eq(files.id, file.id));
      });

      await Promise.all([...folderUpdates, ...fileUpdates]);
    });

    return {
      movedFiles: matchedFiles.length,
      movedFolders: matchedFolders.length,
    };
  });

function resolveUniqueFileNames(
  existingNames: Set<string>,
  items: { id: string; name: string }[],
): Map<string, string> {
  const renames = new Map<string, string>();
  const usedNames = new Set(existingNames);

  for (const item of items) {
    if (!usedNames.has(item.name)) {
      usedNames.add(item.name);
      continue;
    }

    const dotIndex = item.name.lastIndexOf(".");
    const baseName = dotIndex > 0 ? item.name.slice(0, dotIndex) : item.name;
    const ext = dotIndex > 0 ? item.name.slice(dotIndex) : "";

    let suffix = 1;
    let candidate: string;
    do {
      candidate = `${baseName} (${suffix})${ext}`;
      suffix++;
    } while (usedNames.has(candidate));

    usedNames.add(candidate);
    renames.set(item.id, candidate);
  }

  return renames;
}

function resolveUniqueFolderNames(
  existingNames: Set<string>,
  items: { id: string; name: string }[],
): Map<string, string> {
  const renames = new Map<string, string>();
  const usedNames = new Set(existingNames);

  for (const item of items) {
    if (!usedNames.has(item.name)) {
      usedNames.add(item.name);
      continue;
    }

    let suffix = 1;
    let candidate: string;
    do {
      candidate = `${item.name} (${suffix})`;
      suffix++;
    } while (usedNames.has(candidate));

    usedNames.add(candidate);
    renames.set(item.id, candidate);
  }

  return renames;
}

function checkCycleForFolders(
  childrenByParent: Map<string | null, string[]>,
  folderIdsToMove: string[],
  targetFolderId: string | null,
): boolean {
  for (const folderId of folderIdsToMove) {
    const descendants = new Set<string>();
    const stack = [folderId];

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) continue;
      descendants.add(current);

      const children = childrenByParent.get(current) ?? [];
      for (const childId of children) {
        if (!descendants.has(childId)) stack.push(childId);
      }
    }

    if (targetFolderId && descendants.has(targetFolderId)) {
      return true;
    }
  }

  return false;
}
