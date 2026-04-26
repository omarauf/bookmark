import type { LinkPreview } from "@workspace/contracts/link";

export function mergeMetadata(primary = defaultMetadata, secondary = defaultMetadata): LinkPreview {
  return {
    url: secondary.url ?? primary.url,
    mediaType: secondary.mediaType ?? primary.mediaType,

    favicons: mergeArrays(primary.favicons, secondary.favicons),
    images: mergeArrays(primary.images, secondary.images),
    videos: mergeArrays(primary.videos, secondary.videos),

    title: pick(primary.title, secondary.title),
    siteName: pick(primary.siteName, secondary.siteName),
    description: pick(primary.description, secondary.description),

    charset: secondary.charset ?? primary.charset,
    contentType: secondary.contentType ?? primary.contentType,
  };
}

function mergeArrays<T>(primary?: T[], secondary?: T[]) {
  return Array.from(new Set([...(primary || []), ...(secondary || [])]));
}

function pick(primary?: string, secondary?: string) {
  if (secondary && secondary.trim() !== "") return secondary;
  return primary;
}

const defaultMetadata: LinkPreview = {
  url: "",
  mediaType: "",
  favicons: [],
};
