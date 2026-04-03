import type { BitrateInfo, ItemList } from "@workspace/contracts/raw/tiktok";
import type { TiktokMedia } from "@workspace/contracts/tiktok";

export function mediaParser(post: ItemList): TiktokMedia[] {
  const media: TiktokMedia[] = [];

  if (post.imagePost) {
    post.imagePost.images.forEach((image) => {
      const url = image.imageURL.urlList[0];
      if (!url) throw new Error("No image URL found");
      media.push({
        url: url,
        width: image.imageWidth,
        height: image.imageHeight,
        mediaType: "image",
      });
    });
  }

  const maxVideo = post.video.bitrateInfo?.reduce<BitrateInfo | null>(
    (max, v) => (!max || (max.Bitrate !== undefined && v.Bitrate > max.Bitrate) ? v : max),
    null,
  );
  if (!maxVideo) return media;

  const videoUrl = maxVideo.PlayAddr.UrlList[1]; // using v19
  const thumbnail = post.video.originCover;

  if (!videoUrl) throw new Error("No video URL found");

  media.push({
    mediaType: "video",
    url: videoUrl,
    thumbnail: thumbnail,
    width: post.video.width,
    height: post.video.height,
    duration: post.video.duration,
  });

  return media;
}
