import { FileSchemas } from "@workspace/contracts/file-manager";
import { and, eq, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/core/db";
import { s3Client } from "@/core/s3";
import { protectedProcedure } from "@/lib/orpc";
import { folderRepo } from "../repo";
import { files } from "../schema";
import { extractRichMetadata } from "../utils/extract-metadata";
import { parseFileUpload } from "../utils/file";

export const uploadHandler = protectedProcedure
  .route({ path: "/file/upload" })
  .input(FileSchemas.upload.request)
  .output(FileSchemas.upload.response)
  .errors({ BAD_REQUEST: { message: "Folder not found" } })
  .handler(async ({ input: { files: fileList, folderId }, errors }) => {
    if (folderId) {
      const exists = await folderRepo.existsById(folderId);
      if (!exists) throw errors.BAD_REQUEST();
    }

    const result = {
      success: [] as string[],
      failed: [] as string[],
    };

    for (const file of fileList) {
      const metadata = parseFileUpload(file);
      if (!metadata) {
        result.failed.push(file.name);
        continue;
      }

      const existingFile = await getExistingFile(file, folderId);

      const s3Key = existingFile ? existingFile.s3Key : `files/${nanoid(12)}.${metadata.extension}`;

      const buffer = await file.arrayBuffer().then(Buffer.from);
      const [_, s3Error] = await s3Client.upload(s3Key, buffer);
      if (s3Error) {
        result.failed.push(file.name);
        continue;
      }

      const richMetadata = await extractRichMetadata(buffer, metadata.mimeType, metadata.type);

      if (existingFile) {
        await db
          .update(files)
          .set({ ...metadata, folderId, metadata: richMetadata })
          .where(eq(files.id, existingFile.id));
      } else {
        await db.insert(files).values({ ...metadata, folderId, s3Key, metadata: richMetadata });
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
