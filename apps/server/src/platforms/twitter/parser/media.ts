import type { CreateDownloadTask } from "@workspace/contracts/download-task";
import type {
  FluffyMedia,
  PurpleMedia,
  TentacledMedia,
  Variant,
} from "@workspace/contracts/raw/twitter";
import { MediaType } from "@workspace/contracts/raw/twitter";

export function mediaParser(
  externalId: string,
  media: (TentacledMedia | PurpleMedia | FluffyMedia)[],
): CreateDownloadTask[] {
  const mediaDownloadTasks: CreateDownloadTask[] = [];

  media.forEach((m, i) => {
    switch (m.type) {
      case MediaType.AnimatedGIF:
      case MediaType.Video: {
        const maxVideo = m.video_info?.variants.reduce<Variant | null>((max, v) => {
          if (v.bitrate === undefined) return max; // skip items without bitrate
          if (!max || (max.bitrate !== undefined && v.bitrate > max.bitrate)) {
            return v;
          }
          return max;
        }, null);

        if (!maxVideo) {
          throw new Error("No video variants found");
        }

        mediaDownloadTasks.push({
          type: MediaType.Video ? "video" : "gif",
          url: maxVideo.url,
          key: `twitter/post/${externalId}-${i}.mp4`,
          externalId,
          platform: "twitter",
          width: m.original_info.width,
          height: m.original_info.height,
          duration: m.video_info?.duration_millis ? m.video_info.duration_millis / 1000 : 0,
          // TODO: add size if possible for all platform re-check again
        });

        mediaDownloadTasks.push({
          type: "image",
          url: m.media_url_https,
          externalId,
          platform: "twitter",
          key: `twitter/post/${externalId}-${i}.jpg`,
          width: m.original_info.width,
          height: m.original_info.height,
        });
        break;
      }

      case MediaType.Photo: {
        mediaDownloadTasks.push({
          externalId,
          key: `twitter/post/${externalId}-${i}.jpg`,
          platform: "twitter",
          type: "image",
          url: m.media_url_https,
          width: m.original_info.width,
          height: m.original_info.height,
        });
        break;
      }

      default:
        throw new Error(`Unknown media type: ${m.type}`);
    }
  });

  return mediaDownloadTasks;
}
