import type { NormalizedMedia } from "@workspace/contracts/media";
import type { Media } from "./schema";

const getBaseKey = (key: string) => key.replace(/\.[^/.]+$/, "");

export function normalizeMedia(media: Media | Media[]) {
  const m = Array.isArray(media) ? media : [media];

  const imageMap = new Map<string, Media>();
  const videoMap = new Map<string, Media>();

  for (const item of m) {
    const base = getBaseKey(item.key);

    if (item.type === "image") {
      imageMap.set(base, item);
    }

    if (item.type === "video") {
      videoMap.set(base, item);
    }
  }

  const result: NormalizedMedia[] = [];

  // handle videos
  for (const [base, video] of videoMap) {
    const thumbnail = imageMap.get(base);

    result.push({
      type: "video",
      key: video.key,
      thumbnail: thumbnail?.key ?? "",
      duration: video.duration ?? 0,
      width: video.width ?? 0,
      height: video.height ?? 0,
    });
  }

  // handle standalone images
  for (const [base, image] of imageMap) {
    if (!videoMap.has(base)) {
      result.push({
        type: "image",
        key: image.key,
        width: image.width ?? 0,
        height: image.height ?? 0,
      });
    }
  }

  return result;
}
