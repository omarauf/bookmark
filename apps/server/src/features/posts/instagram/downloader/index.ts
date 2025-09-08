import type { ParsedInstagramPost } from "@workspace/contracts/instagram/post";
import sharp from "sharp";
import { fileManager } from "@/features/file-manager/service";
import { randomDelay } from "@/utils/delay";
import { getFileStream } from "@/utils/download";
import { getFilePaths, getPlaceholderPath } from "../utils";

export async function downloadInstagram(post: ParsedInstagramPost): Promise<boolean> {
  const files = getFilePaths(post);

  let allDownloaded = true;

  for (const file of files) {
    try {
      const exist = await fileManager.exists(file.path);
      if (exist) continue;
      const stream = await getFileStream(file.url);
      const fullPath = await fileManager.saveFile(stream, file.path);
      if (fullPath.endsWith(".jpg")) {
        const thumbnailBuffer = await sharp(fullPath).blur(1).resize(10).toBuffer();
        const placeHolderPath = getPlaceholderPath(file.path);
        fileManager.saveFile(thumbnailBuffer, placeHolderPath);
      }
      await randomDelay(100, 200);
    } catch {
      allDownloaded = false;
      console.error(`Error downloading: ${post.postId}`);
    }
  }

  return allDownloaded;
}
