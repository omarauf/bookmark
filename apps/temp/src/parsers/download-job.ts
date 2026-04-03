import type { CreateDownloadTask } from "@/contracts/download-task";
import type { Media } from "@/contracts/raw/instagram";

export function toDownloadTasks(post: Media): CreateDownloadTask[] {
  const mediaDownloadTasks: CreateDownloadTask[] = [];

  const creator = post.usertags
    ? [...post.usertags.in.map((u) => u.user), post.owner]
    : [post.owner];

  creator.forEach((c) => {
    if (!c) return;
    mediaDownloadTasks.push({
      externalId: c.id,
      url: c.profile_pic_url,
      platform: "instagram",
      key: `instagram/avatar/${c.id}.jpg`,
      type: "image",
    });
  });

  return [...mediaDownloadTasks, ...downloadMedia(post)];
}

function downloadMedia(post: Media): CreateDownloadTask[] {
  const mediaDownloadTasks: CreateDownloadTask[] = [];

  const commonProps = {
    platform: "instagram",
    externalId: post.id,
  } as const;

  switch (post.media_type) {
    case 2: {
      // Video
      const video = post.video_versions?.[0];
      const thumbnail = post.image_versions2?.candidates?.[0];

      if (video === undefined) throw new Error(`Video URL is undefined for post ${post.id}`);

      if (post.video_duration === undefined)
        throw new Error(`Video duration is undefined for post ${post.id}`);

      mediaDownloadTasks.push({
        ...commonProps,
        url: video.url,
        type: "video",
        duration: post.video_duration,
        key: `instagram/post/${commonProps.externalId}-0.mp4`,
        height: video.height,
        width: video.width,
      });

      // Push video thumbnail as image
      mediaDownloadTasks.push({
        ...commonProps,
        url: thumbnail.url,
        type: "image",
        key: `instagram/post/${commonProps.externalId}-0.jpg`,
        height: video.height,
        width: video.width,
      });
      break;
    }

    case 1: {
      // Image
      const image = post.image_versions2?.candidates?.[0];

      if (!image) throw new Error("No image candidate found");

      mediaDownloadTasks.push({
        ...commonProps,
        url: image.url,
        width: image.width,
        height: image.height,
        type: "image",
        key: `instagram/post/${commonProps.externalId}-0.jpg`,
      });
      break;
    }

    case 8: {
      // Carousel

      if (!post.carousel_media) throw new Error("No carousel media found");

      post.carousel_media.forEach((c, i) => {
        const image = c.image_versions2?.candidates?.[0];
        if (!image) throw new Error("No image candidate found");

        const video = c.video_versions?.[0];
        if (video) {
          mediaDownloadTasks.push({
            ...commonProps,
            url: video.url,
            type: "video",
            duration: post.video_duration,
            key: `instagram/post/${commonProps.externalId}-0.mp4`,
            height: video.height,
            width: video.width,
          });

          // Push video thumbnail as image
          mediaDownloadTasks.push({
            ...commonProps,
            url: image.url,
            type: "image",
            key: `instagram/post/${commonProps.externalId}-0.jpg`,
            height: video.height,
            width: video.width,
          });
        }
        // Only push image if no video exists
        else {
          mediaDownloadTasks.push({
            ...commonProps,
            type: "image",
            url: image.url,
            width: image.width,
            height: image.height,
            key: `instagram/post/${commonProps.externalId}-${i}.jpg`,
          });
        }
      });
      break;
    }

    default:
      console.error("Unknown media type:", post.media_type);
      throw new Error(`Unknown media type: ${post.media_type}`);
  }

  return mediaDownloadTasks;
}
