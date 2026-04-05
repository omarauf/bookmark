import { collectionRouter } from "@/modules/collection/route";
import { downloadTaskRouter } from "@/modules/download-task/route";
import { fileManagerRoute } from "@/modules/file-manager/route";
import { importRouter } from "@/modules/import/route";
import { itemRouter } from "@/modules/item/route";
import { linkRouter } from "@/modules/link/route";
import { postRouter } from "@/modules/post/route";
import { tagRouter } from "@/modules/tag/route";

export const appRouter = {
  import: importRouter,
  tag: tagRouter,
  post: postRouter,
  file: fileManagerRoute,
  collection: collectionRouter,
  item: itemRouter,
  link: linkRouter,
  downloadTask: downloadTaskRouter,
};
