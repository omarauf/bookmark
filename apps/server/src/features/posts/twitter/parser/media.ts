import type {
  FluffyMedia,
  PurpleMedia,
  TentacledMedia,
  Variant,
} from "@workspace/contracts/twitter/raw";
import { MediaType } from "@workspace/contracts/twitter/raw";
import type { ParsedTwitterPost } from "../schemas";

export function mediaParser(
  media: TentacledMedia | PurpleMedia | FluffyMedia,
): ParsedTwitterPost["media"][number] {
  switch (media.type) {
    case MediaType.AnimatedGIF:
    case MediaType.Video: {
      const maxVideo = media.video_info?.variants.reduce<Variant | null>((max, v) => {
        if (v.bitrate === undefined) return max; // skip items without bitrate
        if (!max || (max.bitrate !== undefined && v.bitrate > max.bitrate)) {
          return v;
        }
        return max;
      }, null);

      if (!maxVideo) {
        throw new Error("No video variants found");
      }

      return {
        mediaType: MediaType.Video ? "video" : "gif",
        url: maxVideo.url,
        width: media.original_info.width,
        height: media.original_info.height,
        thumbnail: media.media_url_https,
        duration: media.video_info?.duration_millis ? media.video_info.duration_millis / 1000 : 0,
      };
    }

    case MediaType.Photo: {
      return {
        mediaType: "image",
        url: media.media_url_https,
        width: media.original_info.width,
        height: media.original_info.height,
      };
    }

    default:
      throw new Error(`Unknown media type: ${media.type}`);
  }
}
