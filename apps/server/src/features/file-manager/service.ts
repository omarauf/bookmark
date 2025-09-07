import { createWriteStream } from "node:fs";
import { exists, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path, { dirname } from "node:path";
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

export const fileManager = {
  async write(filePath: FilePath, data: Buffer | string): Promise<void> {
    const parts = filePath.split("/");
    const fullPath = path.join(path.resolve(process.cwd()), "src", "data", ...parts);
    await mkdir(fullPath, { recursive: true });
    await writeFile(fullPath, data);
  },

  async saveFile(data: Readable | Buffer, filePath: FilePath | string): Promise<string> {
    const parts = filePath.split("/");
    const fullPath = path.join(path.resolve(process.cwd()), "src", "data", ...parts);
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
    const parts = filePath.split("/");
    const fullPath = path.join(path.resolve(process.cwd()), "src", "data", ...parts);
    return readFile(fullPath, "utf-8");
  },

  async readFile(filePath: FilePath | string) {
    const parts = filePath.split("/");
    const fullPath = path.join(path.resolve(process.cwd()), "src", "data", ...parts);
    return await readFile(fullPath);
  },

  async getPath(filePath: FilePath): Promise<string> {
    const parts = filePath.split("/");
    return path.join(path.resolve(process.cwd()), "src", "data", ...parts);
  },

  async delete(filePath: FilePath): Promise<void> {
    const parts = filePath.split("/");
    const fullPath = path.join(path.resolve(process.cwd()), "src", "data", ...parts);
    await unlink(fullPath);
  },

  async exists(filePath: FilePath | string): Promise<boolean> {
    const parts = filePath.split("/");
    const fullPath = path.join(path.resolve(process.cwd()), "src", "data", ...parts);
    const dirPath = dirname(fullPath);

    const isExists = await exists(dirPath);
    if (!isExists) await mkdir(dirPath, { recursive: true });

    return await exists(fullPath);
  },
};
