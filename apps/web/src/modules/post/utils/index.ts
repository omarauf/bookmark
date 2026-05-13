import type { NormalizedMedia } from "@workspace/contracts/media";

export function getThumbnailUrl(media: NormalizedMedia[]) {
  const first = media[0];
  if (first === undefined) return "";
  if (first.type === "image") return first.key;
  return first.thumbnail;
}
