import type { MediaProductType } from "@/contracts/raw/instagram";

export function getMediaType(media_type: number, product_type: MediaProductType) {
  if (media_type === 1) {
    return "Photo";
  }

  if (media_type === 2) {
    switch (product_type) {
      case "feed":
        return "Video";
      case "igtv":
        return "IGTV";
      case "clips":
        return "Reel";
      default:
        throw new Error(`Unknown product_type: ${product_type}`);
    }
  }

  if (media_type === 8) {
    return "Carousel";
  }

  throw new Error(`Unsupported media_type: ${media_type}`);
}
