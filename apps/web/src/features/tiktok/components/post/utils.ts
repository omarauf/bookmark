import type { TiktokMedia } from "@workspace/contracts/tiktok/media";

export function getThumbnailUrl(media: TiktokMedia) {
  //
  if (media.mediaType === "video") {
    return media.thumbnail;
  }

  //
  return media.url;
}
