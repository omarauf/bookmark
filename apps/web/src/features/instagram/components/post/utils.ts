import type { InstagramMedia } from "@workspace/contracts/instagram/media";

export function getThumbnailUrl(media: InstagramMedia) {
  if (media.mediaType === "carousel") {
    const first = media.media[0];

    if (first.mediaType === "image") return first.url;
    return first.thumbnail;
  }

  //
  if (media.mediaType === "video") {
    return media.thumbnail;
  }

  //
  return media.url;
}
