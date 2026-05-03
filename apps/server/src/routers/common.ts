import { collectionRouter } from "@/modules/collection/route";
import { browseRouter } from "@/modules/file-manager/browse.route";
import { fileRouter } from "@/modules/file-manager/file.route";
import { folderRouter } from "@/modules/file-manager/folder.route";
import { imdbRouter } from "@/modules/imdb/route";
import { importRouter } from "@/modules/import/route";
import { itemRouter } from "@/modules/item/route";
import { jobRouter } from "@/modules/job/route";
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
  file: fileRouter,
  folder: folderRouter,
  browse: browseRouter,
  job: jobRouter,
  imdb: imdbRouter,
};
