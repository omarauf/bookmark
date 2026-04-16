import { collectionRouter } from "@/modules/collection/route";
import { downloadTaskRouter } from "@/modules/download-task/route";
import { browseRouter } from "@/modules/file-manager/browse.route";
import { fileRouter } from "@/modules/file-manager/file.route";
import { folderRouter } from "@/modules/file-manager/folder.route";
import { importRouter } from "@/modules/import/route";
import { itemRouter } from "@/modules/item/route";
import { linkRouter } from "@/modules/link/route";
import { postRouter } from "@/modules/post/route";
import { tagRouter } from "@/modules/tag/route";

export const appRouter = {
  import: importRouter,
  tag: tagRouter,
  post: postRouter,
  collection: collectionRouter,
  item: itemRouter,
  link: linkRouter,
  downloadTask: downloadTaskRouter,
  file: fileRouter,
  folder: folderRouter,
  browse: browseRouter,
};
