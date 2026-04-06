import type { CreateDownloadTask } from "@workspace/contracts/download-task";
import type { BitrateInfo, ItemList } from "@workspace/contracts/raw/tiktok";

export function toDownloadTasks(post: ItemList): CreateDownloadTask[] {
  return [...downloadProfile(post), ...downloadMedia(post)];
}

function downloadProfile(post: ItemList): CreateDownloadTask[] {
  const profilePicture = post.author.avatarLarger;

  const mediaDownloadTasks: CreateDownloadTask[] = [];

  mediaDownloadTasks.push({
    externalId: post.author.id,
    url: profilePicture,
    platform: "tiktok",
    key: `tiktok/avatar/${post.author.id}.jpg`,
    type: "image",
  });

  return mediaDownloadTasks;
}

function downloadMedia(post: ItemList): CreateDownloadTask[] {
  const mediaDownloadTasks: CreateDownloadTask[] = [];

  const commonProps = {
    platform: "tiktok",
    externalId: post.id,
  } as const;

  if (post.imagePost) {
    post.imagePost.images.forEach((image, index) => {
      const url = image.imageURL.urlList[0];
      if (!url) throw new Error("No image URL found");
      mediaDownloadTasks.push({
        ...commonProps,
        url: url,
        width: image.imageWidth,
        height: image.imageHeight,
        type: "image",
        key: `tiktok/post/${commonProps.externalId}-${index}.jpg`,
      });
    });
  }

  const maxVideo = post.video.bitrateInfo?.reduce<BitrateInfo | null>(
    (max, v) => (!max || (max.Bitrate !== undefined && v.Bitrate > max.Bitrate) ? v : max),
    null,
  );
  if (!maxVideo) return mediaDownloadTasks;

  const videoUrl = maxVideo.PlayAddr.UrlList[1]; // using v19
  const thumbnail = post.video.originCover;

  if (!videoUrl) throw new Error("No video URL found");

  mediaDownloadTasks.push({
    ...commonProps,
    url: videoUrl,
    type: "video",
    key: `tiktok/post/${commonProps.externalId}-0.mp4`,
    width: post.video.width,
    height: post.video.height,
    duration: post.video.duration,
  });

  // Push video thumbnail as image
  mediaDownloadTasks.push({
    ...commonProps,
    url: thumbnail,
    type: "image",
    key: `tiktok/post/${commonProps.externalId}-0.jpg`,
    height: post.video.height,
    width: post.video.width,
  });

  return mediaDownloadTasks;
}
