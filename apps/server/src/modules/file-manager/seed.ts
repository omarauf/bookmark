import type {
  FileExtension,
  FileMetadata,
  FileType,
  MimeType,
} from "@workspace/contracts/file-manager";
import { db } from "@/core/db";
import { files, folders } from "./schema";

type SeedFileTemplate = {
  label: string;
  type: FileType;
  mimeType: MimeType;
  extension: FileExtension;
  metadataFactory: (index: number) => FileMetadata | undefined;
};

const FILE_TEMPLATES: SeedFileTemplate[] = [
  {
    label: "image",
    type: "image",
    mimeType: "image/jpeg",
    extension: "jpg",
    metadataFactory: (index) => ({
      type: "image",
      width: 1280 + (index % 4) * 120,
      height: 720 + (index % 3) * 80,
      format: "jpeg",
    }),
  },
  {
    label: "screenshot",
    type: "image",
    mimeType: "image/png",
    extension: "png",
    metadataFactory: (index) => ({
      type: "image",
      width: 1920,
      height: 1080 + (index % 2) * 120,
      format: "png",
    }),
  },
  {
    label: "clip",
    type: "video",
    mimeType: "video/mp4",
    extension: "mp4",
    metadataFactory: (index) => ({
      type: "video",
      duration: 12 + (index % 9) * 4,
      width: 1280,
      height: 720,
      codec: "h264",
      fps: 30,
    }),
  },
  {
    label: "podcast",
    type: "audio",
    mimeType: "audio/mpeg",
    extension: "mp3",
    metadataFactory: (index) => ({
      type: "audio",
      duration: 30 + (index % 15) * 8,
      bitrate: 192,
      codec: "mp3",
    }),
  },
  {
    label: "doc",
    type: "pdf",
    mimeType: "application/pdf",
    extension: "pdf",
    metadataFactory: (index) => ({
      type: "pdf",
      pages: 2 + (index % 11),
      author: "Seed Bot",
    }),
  },
  {
    label: "dataset",
    type: "text",
    mimeType: "text/csv",
    extension: "csv",
    metadataFactory: () => undefined,
  },
];

type SeedFileManagerOptions = {
  totalItems?: number;
  fileRatio?: number;
  rootFolderId?: string;
  rootFolderName?: string;
  resetExisting?: boolean;
  log?: boolean;
};

type SeedFileManagerResult = {
  rootFolderId: string;
  folderCount: number;
  fileCount: number;
};

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const toChunks = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

export async function seedFileManagerDummyData(
  options: SeedFileManagerOptions = {},
): Promise<SeedFileManagerResult> {
  const totalItems = Math.max(20, options.totalItems ?? 200);
  const fileRatio = Math.min(0.95, Math.max(0.5, options.fileRatio ?? 0.8));
  const fileCount = Math.max(1, Math.floor(totalItems * fileRatio));
  const folderCount = Math.max(1, totalItems - fileCount);

  const result = await db.transaction(async (tx) => {
    if (options.resetExisting) {
      await tx.delete(files);
      await tx.delete(folders);
    }

    let rootFolderId = options.rootFolderId;

    if (!rootFolderId) {
      const [rootFolder] = await tx
        .insert(folders)
        .values({
          name: options.rootFolderName ?? `seed-root-${Date.now()}`,
          parentId: null,
        })
        .returning({ id: folders.id });

      rootFolderId = rootFolder.id;
    }

    const topLevelFolderCount = Math.max(3, Math.min(8, Math.floor(folderCount / 3) || 3));
    const topLevelValues = Array.from(
      { length: Math.min(folderCount, topLevelFolderCount) },
      (_, i) => ({
        name: `seed-folder-${String(i + 1).padStart(2, "0")}`,
        parentId: rootFolderId,
      }),
    );

    const createdTopLevelFolders =
      topLevelValues.length > 0
        ? await tx.insert(folders).values(topLevelValues).returning({ id: folders.id })
        : [];

    const allFolderIds = [rootFolderId, ...createdTopLevelFolders.map((folder) => folder.id)];

    const remainingFolderCount = Math.max(0, folderCount - topLevelValues.length);
    if (remainingFolderCount > 0) {
      const nestedFolderValues = Array.from({ length: remainingFolderCount }, (_, i) => {
        const parentId = allFolderIds[randomInt(0, allFolderIds.length - 1)];
        return {
          name: `seed-nested-${String(i + 1).padStart(3, "0")}`,
          parentId,
        };
      });

      const createdNestedFolders = await tx
        .insert(folders)
        .values(nestedFolderValues)
        .returning({ id: folders.id });

      allFolderIds.push(...createdNestedFolders.map((folder) => folder.id));
    }

    const fileValues = Array.from({ length: fileCount }, (_, i) => {
      const template = FILE_TEMPLATES[i % FILE_TEMPLATES.length];
      const folderId = allFolderIds[randomInt(0, allFolderIds.length - 1)];
      const name = `${template.label}-${String(i + 1).padStart(4, "0")}.${template.extension}`;

      return {
        name,
        mimeType: template.mimeType,
        size: randomInt(20_000, 25_000_000),
        type: template.type,
        extension: template.extension,
        s3Key: `seed/${folderId}/${name}`,
        folderId,
        metadata: template.metadataFactory(i),
      };
    });

    for (const chunk of toChunks(fileValues, 100)) {
      await tx.insert(files).values(chunk);
    }

    return {
      rootFolderId,
      folderCount: allFolderIds.length,
      fileCount,
    };
  });

  if (options.log ?? true) {
    console.log(
      `Seeded ${result.folderCount} folders and ${result.fileCount} files in file manager (root: ${result.rootFolderId})`,
    );
  }

  return result;
}

export async function seedFilesForFolder(folderId: string): Promise<{ fileCount: number }> {
  const fileCount = 30;

  const fileValues = Array.from({ length: fileCount }, (_, i) => {
    const template = FILE_TEMPLATES[i % FILE_TEMPLATES.length];
    const name = `${template.label}-${String(i + 1).padStart(4, "0")}.${template.extension}`;

    return {
      name,
      mimeType: template.mimeType,
      size: randomInt(20_000, 25_000_000),
      type: template.type,
      extension: template.extension,
      s3Key: `seed/${folderId}/${name}`,
      folderId,
      metadata: template.metadataFactory(i),
    };
  });

  await db.transaction(async (tx) => {
    for (const chunk of toChunks(fileValues, 100)) {
      await tx.insert(files).values(chunk);
    }
  });

  return { fileCount };
}
