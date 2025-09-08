import { createWriteStream } from "node:fs";
import { access, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Readable } from "node:stream";

export type FilePath =
  | `json/${string}.json`
  | `link/${string}.jpg`
  | `instagram/user/${string}.jpg`
  | `instagram/video/${string}.jpg`
  | `instagram/image/${string}.jpg`
  | `instagram/video/${string}.mp4`
  | `instagram/carousel/${string}-${number}.jpg`
  | `instagram/carousel/${string}-${number}.mp4`;

const dataDir = path.join(path.resolve(process.cwd()), "src", "data");
const resolveFullPath = (filePath: FilePath | string) => path.join(dataDir, ...filePath.split("/"));

const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

export const fileManager = {
  async write(filePath: FilePath, data: Buffer | string): Promise<void> {
    const fullPath = resolveFullPath(filePath);
    await mkdir(path.dirname(fullPath), { recursive: true });
    await writeFile(fullPath, data);
  },

  async saveFile(data: Readable | Buffer, filePath: FilePath | string): Promise<string> {
    const fullPath = resolveFullPath(filePath);
    await mkdir(path.dirname(fullPath), { recursive: true });
    const writer = createWriteStream(fullPath);

    if (Buffer.isBuffer(data)) {
      writer.write(data);
      writer.end();
    } else {
      data.pipe(writer);
    }

    return new Promise<string>((resolve, reject) => {
      writer.on("finish", () => resolve(fullPath));
      writer.on("error", reject);
    });
  },

  async readFileAsString(filePath: FilePath): Promise<string> {
    const fullPath = resolveFullPath(filePath);
    return readFile(fullPath, "utf-8");
  },

  async readFile(filePath: FilePath | string) {
    const fullPath = resolveFullPath(filePath);
    return await readFile(fullPath);
  },

  async getPath(filePath: FilePath): Promise<string> {
    return resolveFullPath(filePath);
  },

  async delete(filePath: FilePath): Promise<void> {
    const fullPath = resolveFullPath(filePath);
    if (await fileExists(fullPath)) {
      await unlink(fullPath);
    }
  },

  async exists(filePath: FilePath | string): Promise<boolean> {
    const fullPath = resolveFullPath(filePath);
    return fileExists(fullPath);
  },
};
