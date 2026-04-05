import type { Item1 } from "./item-1";
import type { Item2 } from "./item-2";

export function Music1(a: Item1) {
  if (a.platform === "tiktok" && a.kind === "post") {
    return `${a.metadata?.music?.title} - ${a.metadata?.music?.authorName}`;
  }

  if (a.platform === "instagram" && a.kind === "post") {
    if (a.metadata.music?.original) {
      return "Original Audio";
    }

    return `${a.metadata?.music?.title} - ${a.metadata?.music?.artist}`;
  }

  return null;
}

// ---------------------------------------------------------------------------------

export function Music2(a: Item2) {
  // if (a.metadata.platform === "tiktok" && a.metadata.kind === "post") {
  //   return `${a.metadata?.music?.title} - ${a.metadata?.music?.authorName}`;
  // }

  if (a.platform === "tiktok" && a.kind === "post") {
  }

  if (a.metadata.platform === "instagram" && a.metadata.kind === "post") {
    if (a.metadata.music?.original) {
      return "Original Audio";
    }

    return `${a.metadata?.music?.title} - ${a.metadata?.music?.artist}`;
  }

  return null;
}
