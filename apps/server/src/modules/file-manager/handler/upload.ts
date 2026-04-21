import { FileSchemas } from "@workspace/contracts/file-manager";
import { and, eq, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/core/db";
import { s3Client } from "@/core/s3";
import { protectedProcedure } from "@/lib/orpc";
import { folderRepo } from "../repo";
import { files } from "../schema";
import { extractFileMetadata } from "../utils";

export const uploadHandler = protectedProcedure
  .route({ path: "/file/upload" })
  .input(FileSchemas.upload.request)
  .output(FileSchemas.upload.response)
  .errors({ BAD_REQUEST: { message: "Folder not found" } })
  .handler(async ({ input: { files: fileList, folderId }, errors }) => {
    // ✅ Validate folder
    if (folderId) {
      const exists = await folderRepo.existsById(folderId);
      if (!exists) throw errors.BAD_REQUEST();
    }

    const result = {
      success: [] as string[],
      failed: [] as string[],
    };

    for (const file of fileList) {
      // ✅ Extract metadata
      const metadata = extractFileMetadata(file);
      if (!metadata) {
        result.failed.push(file.name);
        continue;
      }

      // ✅ Check if file exists (by name + folder)
      const existingFile = await getExistingFile(file, folderId);

      // ✅ Decide S3 key
      const s3Key = existingFile ? existingFile.s3Key : `files/${nanoid(12)}.${metadata.extension}`;

      // ✅ Upload to S3
      const uploadedS3Key = await uploadToS3(file, s3Key);
      if (!uploadedS3Key) {
        result.failed.push(file.name);
        continue;
      }

      if (existingFile) {
        await db
          .update(files)
          .set({ ...metadata, folderId, metadata: null })
          .where(eq(files.id, existingFile.id));
      } else {
        await db.insert(files).values({ ...metadata, folderId, s3Key, metadata: null });
      }

      result.success.push(file.name);
    }

    return result;
  });

async function getExistingFile(file: File, folderId?: string) {
  const currentFile = await db
    .select()
    .from(files)
    .where(
      and(
        eq(files.name, file.name),
        folderId ? eq(files.folderId, folderId) : isNull(files.folderId),
      ),
    )
    .limit(1);

  return currentFile.length ? currentFile[0] : undefined;
}

async function uploadToS3(file: File, s3Key: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const [_, s3Error] = await s3Client.upload(s3Key, buffer);
  if (s3Error) return undefined;

  return s3Key;
}
