import { collectionRouter } from "./collection/router";
import { fileManagerRoute } from "./file-manager/route";
import { importRouter } from "./import/route";
import { linkRouter } from "./link/route";
import { postRouter } from "./posts/base/routes/post";
import { userRouter } from "./posts/base/routes/user";
import { instagramPostRouter } from "./posts/instagram/routes/post";
import { tagRouter } from "./tag/router";

export const features = {
  links: linkRouter,
  tags: tagRouter,
  collections: collectionRouter,
  imports: importRouter,
  posts: postRouter,
  users: userRouter,
  instagramPosts: instagramPostRouter,
  files: fileManagerRoute,
};
