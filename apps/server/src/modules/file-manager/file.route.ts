import { FileSchemas } from "@workspace/contracts/file-manager";
import { and, asc, desc, eq, ilike, isNull, sql } from "drizzle-orm";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
import { uploadHandler } from "./handler/upload";
import { fileRepo, folderRepo } from "./repo";
import { files } from "./schema";
import * as service from "./service";

export const fileRouter = {
  list: protectedProcedure
    .input(FileSchemas.fileList.request)
    .output(FileSchemas.fileList.response)
    .handler(async ({ input: { folderId, query, type } }) => {
      const conditions = and(
        folderId ? eq(files.folderId, folderId) : isNull(files.folderId),
        type ? eq(files.type, type) : undefined,
        query ? ilike(files.name, `%${query}%`) : undefined,
      );

      return await db
        .select()
        .from(files)
        .where(conditions)
        .orderBy(desc(files.createdAt), asc(files.name));
    }),

  get: protectedProcedure
    .input(FileSchemas.get.request)
    .output(FileSchemas.get.response)
    .errors({ NOT_FOUND: { message: "File not found" } })
    .handler(async ({ input: { id }, errors }) => {
      const file = await fileRepo.findById(id);
      if (!file) throw errors.NOT_FOUND();

      return file;
    }),

  upload: uploadHandler,

  rename: protectedProcedure
    .input(FileSchemas.rename.request)
    .output(FileSchemas.rename.response)
    .errors({
      NOT_FOUND: { message: "File not found" },
      CONFLICT: { message: "File already exists in this location" },
    })
    .handler(async ({ input, errors }) => {
      const file = await fileRepo.findById(input.id);
      if (!file) throw errors.NOT_FOUND();

      const conflict = await service.isFileNameTaken(file.folderId, input.name, file.id);
      if (conflict) throw errors.CONFLICT();

      const [updated] = await db
        .update(files)
        .set({ name: input.name })
        .where(eq(files.id, input.id))
        .returning();

      return updated;
    }),

  move: protectedProcedure
    .input(FileSchemas.move.request)
    .output(FileSchemas.move.response)
    .errors({
      NOT_FOUND: { message: "File not found" },
      BAD_REQUEST: { message: "Folder not found" },
      CONFLICT: { message: "File already exists in this location" },
    })
    .handler(async ({ input: { folderId, id }, errors }) => {
      const file = await fileRepo.findById(id);
      if (!file) throw errors.NOT_FOUND();

      if (folderId) {
        const exists = await folderRepo.existsById(folderId);
        if (!exists) throw errors.BAD_REQUEST();
      }

      const conflict = await service.isFileNameTaken(folderId, file.name, file.id);
      if (conflict) throw errors.CONFLICT();

      const [updated] = await db
        .update(files)
        .set({ folderId })
        .where(eq(files.id, id))
        .returning();

      return updated;
    }),

  delete: protectedProcedure
    .input(FileSchemas.delete.request)
    .output(FileSchemas.delete.response)
    .errors({ NOT_FOUND: { message: "File not found" } })
    .handler(async ({ input, errors }) => {
      const exists = await fileRepo.existsById(input.id);
      if (!exists) throw errors.NOT_FOUND();

      const [deleted] = await db.delete(files).where(eq(files.id, input.id)).returning();
      return deleted;
    }),

  stats: protectedProcedure.output(FileSchemas.stats.response).handler(async () => {
    const [summary] = await db
      .select({
        totalCount: sql<number>`cast(count(*) as int)`,
        totalSize: sql<number>`cast(coalesce(sum(${files.size}), 0) as int)`,
      })
      .from(files);

    const byType = await db
      .select({
        type: files.type,
        count: sql<number>`cast(count(*) as int)`,
        size: sql<number>`cast(coalesce(sum(${files.size}), 0) as int)`,
      })
      .from(files)
      .groupBy(files.type)
      .orderBy(files.type);

    const byExtension = await db
      .select({
        extension: files.extension,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(files)
      .groupBy(files.extension)
      .orderBy(files.extension);

    return {
      totalCount: summary.totalCount,
      totalSize: summary.totalSize,
      byType,
      byExtension,
    };
  }),

  download: protectedProcedure
    .input(FileSchemas.download.request)
    .output(FileSchemas.download.response)
    .errors({ NOT_FOUND: { message: "File not found" } })
    .handler(async ({ input, errors }) => {
      const file = await fileRepo.findById(input.id);
      if (!file) throw errors.NOT_FOUND();

      // S3 download URL generation will go here later.
      // const downloadUrl = await s3.getSignedUrl("getObject", { Key: file.s3Key });

      return {
        s3Key: file.s3Key,
        downloadUrl: undefined,
      };
    }),

  preview: protectedProcedure
    .input(FileSchemas.preview.request)
    .output(FileSchemas.preview.response)
    .errors({ NOT_FOUND: { message: "File not found" } })
    .handler(async ({ input, errors }) => {
      const file = await fileRepo.findById(input.id);
      if (!file) throw errors.NOT_FOUND();

      // S3 preview URL generation will go here later.
      return {
        s3Key: file.s3Key,
        downloadUrl: undefined,
      };
    }),
};
