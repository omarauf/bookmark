import type { Post } from "@workspace/contracts/post";

export function getThumbnailUrl(media: Post["media"][number]) {
  //
  if (media.type === "video") {
    return media.thumbnail;
  }

  //
  return media.key;
}
