import { FileSchemas } from "@workspace/contracts/file-manager";
import { and, asc, desc, eq, ilike, inArray, isNull, sql } from "drizzle-orm";
import { v7 as uuidV7 } from "uuid";
import { db } from "@/core/db";
import { protectedProcedure } from "@/lib/orpc";
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

  create: protectedProcedure
    .input(FileSchemas.create.request)
    .output(FileSchemas.create.response)
    .errors({
      BAD_REQUEST: { message: "Folder not found" },
      CONFLICT: { message: "File already exists in this location" },
    })
    .handler(async ({ input, errors }) => {
      const { folderId } = input;
      if (folderId) {
        const exists = await folderRepo.existsById(folderId);
        if (!exists) throw errors.BAD_REQUEST();
      }

      const conflict = await service.isFileNameTaken(folderId, input.name);
      if (conflict) throw errors.CONFLICT();

      const fileId = uuidV7();

      // S3 presigned upload URL generation will go here later.
      // const uploadUrl = await s3.getSignedUrl("putObject", { Key: s3Key, ContentType: input.mimeType });

      const [created] = await db
        .insert(files)
        .values({
          id: fileId,
          name: input.name,
          mimeType: input.mimeType,
          size: input.size,
          type: input.type,
          extension: input.extension,
          folderId,
          metadata: input.metadata ?? null,
          s3Key: `files/${uuidV7()}-${input.name}`, // TODO generate proper S3 key after integrating with S3 service
          isDeleted: false,
        })
        .returning();

      return created;
    }),

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

      const [updated] = await db
        .update(files)
        .set({ isDeleted: true })
        .where(eq(files.id, input.id))
        .returning();

      return updated;
    }),

  bulkDelete: protectedProcedure
    .input(FileSchemas.bulkDelete.request)
    .output(FileSchemas.bulkDelete.response)
    .handler(async ({ input }) => {
      const result = await db
        .update(files)
        .set({ isDeleted: true })
        .where(inArray(files.id, input.ids))
        .returning({ id: files.id });

      return { count: result.length };
    }),

  restore: protectedProcedure
    .input(FileSchemas.restore.request)
    .output(FileSchemas.restore.response)
    .errors({ NOT_FOUND: { message: "File not found" } })
    .handler(async ({ input, errors }) => {
      const exists = await fileRepo.existsById(input.id);
      if (!exists) throw errors.NOT_FOUND();

      const [updated] = await db
        .update(files)
        .set({ isDeleted: false })
        .where(eq(files.id, input.id))
        .returning();

      return updated;
    }),

  permanentDelete: protectedProcedure
    .input(FileSchemas.permanentDelete.request)
    .output(FileSchemas.permanentDelete.response)
    .errors({ NOT_FOUND: { message: "File not found" } })
    .handler(async ({ input, errors }) => {
      const exists = await fileRepo.existsById(input.id);
      if (!exists) throw errors.NOT_FOUND();

      // S3 cleanup will be wired here later:
      // await s3.deleteObject(file.s3Key);

      const [deleted] = await db.delete(files).where(eq(files.id, input.id)).returning();
      return deleted;
    }),

  trash: protectedProcedure.output(FileSchemas.trash.response).handler(async () => {
    return await db
      .select()
      .from(files)
      .where(eq(files.isDeleted, true))
      .orderBy(desc(files.createdAt), asc(files.name));
  }),

  recent: protectedProcedure.output(FileSchemas.recent.response).handler(async () => {
    return await db
      .select()
      .from(files)
      .where(eq(files.isDeleted, false))
      .orderBy(desc(files.createdAt), asc(files.name))
      .limit(20);
  }),

  stats: protectedProcedure.output(FileSchemas.stats.response).handler(async () => {
    const [summary] = await db
      .select({
        totalCount: sql<number>`cast(count(*) as int)`,
        activeCount: sql<number>`cast(coalesce(sum(case when ${files.isDeleted} = false then 1 else 0 end), 0) as int)`,
        deletedCount: sql<number>`cast(coalesce(sum(case when ${files.isDeleted} = true then 1 else 0 end), 0) as int)`,
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
      .where(eq(files.isDeleted, false))
      .groupBy(files.type)
      .orderBy(files.type);

    const byExtension = await db
      .select({
        extension: files.extension,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(files)
      .where(eq(files.isDeleted, false))
      .groupBy(files.extension)
      .orderBy(files.extension);

    return {
      totalCount: summary.totalCount,
      activeCount: summary.activeCount,
      deletedCount: summary.deletedCount,
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
