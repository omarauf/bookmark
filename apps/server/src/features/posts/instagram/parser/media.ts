import type { CreateInstagramMedia } from "@workspace/contracts/instagram/media";
import type { Media } from "@workspace/contracts/instagram/raw";

export function mediaParser(post: Media): CreateInstagramMedia {
  let media: CreateInstagramMedia;
  switch (post.media_type) {
    case 2: {
      // Video
      const video = post.video_versions?.[0];
      const thumbnail = post.image_versions2?.candidates?.[0];

      if (video === undefined) throw new Error(`Video URL is undefined for post ${post.id}`);

      if (post.video_duration === undefined)
        throw new Error(`Video duration is undefined for post ${post.id}`);

      media = {
        mediaType: "video",
        url: video.url,
        height: video.height,
        width: video.width,
        thumbnail: thumbnail.url,
        duration: post.video_duration,
        playCount: post.play_count || 0,
        viewCount: post.view_count || 0,
      };
      break;
    }

    case 1: {
      // Image
      const image = post.image_versions2?.candidates?.[0];

      if (!image) throw new Error("No image candidate found");

      media = {
        mediaType: "image",
        url: image.url,
        width: image.width,
        height: image.height,
      };
      break;
    }

    case 8: {
      // Carousel

      if (!post.carousel_media) throw new Error("No carousel media found");

      media = {
        mediaType: "carousel",
        media: post.carousel_media.map((c) => {
          const image = c.image_versions2?.candidates?.[0];
          if (!image) throw new Error("No image candidate found");

          const video = c.video_versions?.[0];
          if (video) {
            return {
              mediaType: "video",
              url: video.url,
              height: video.height,
              width: video.width,
              thumbnail: image.url,
              duration: c.video_duration || 0,
              playCount: 0,
              viewCount: 0,
            };
          }

          return {
            mediaType: "image",
            url: image.url,
            width: image.width,
            height: image.height,
          };
        }),
      };
      break;
    }

    default:
      console.error("Unknown media type:", post.media_type);
      throw new Error(`Unknown media type: ${post.media_type}`);
  }

  return media;
}
