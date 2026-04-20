import { BrowseSchemas } from "@workspace/contracts/file-manager";
import { and, asc, desc, eq, ilike, isNull } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure, publicProcedure } from "@/lib/orpc";
import { moveHandler } from "./handler/move";
import { folderRepo } from "./repo";
import { files, folders } from "./schema";
import { seedFilesForFolder } from "./seed";

export const browseRouter = {
  seed: publicProcedure.handler(async () => {
    // const existingCount = await db
    //   .select()
    //   .from(files)
    //   .limit(1)
    //   .then((rows) => rows.length);

    // if (existingCount > 0) {
    //   return false;
    // }

    // const seedFiles = await seedFileManagerDummyData();
    await seedFilesForFolder("f2118e3d-f54a-42ca-8729-2498808e62e6");
  }),

  all: protectedProcedure.output(BrowseSchemas.all.response).handler(async () => {
    const [folderRows, fileRows] = await Promise.all([
      db.select().from(folders).orderBy(asc(folders.name), asc(folders.createdAt)),
      db
        .select()
        .from(files)
        .where(eq(files.isDeleted, false))
        .orderBy(desc(files.createdAt), asc(files.name)),
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
      const parentId = input.parentId ?? undefined;

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
          .where(
            and(
              parentId ? eq(files.folderId, parentId) : isNull(files.folderId),
              eq(files.isDeleted, false),
            ),
          )
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
          .where(and(eq(files.isDeleted, false), ilike(files.name, query)))
          .orderBy(desc(files.createdAt), asc(files.name)),
      ]);

      return {
        folders: matchedFolders,
        files: matchedFiles,
      };
    }),

  move: moveHandler,
};
