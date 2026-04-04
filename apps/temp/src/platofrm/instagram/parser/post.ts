import type { CreateItem } from "@/contracts/item";
import type { Media, MediaProductType } from "@/contracts/raw/instagram";
import { locationParser } from "./location";
import { musicParser } from "./music";

export function postParser(post: Media): CreateItem {
  const postId = post.id;
  const url = `https://www.instagram.com/p/${post.code}`;
  const text = post.caption?.text;
  const location = locationParser(post.location);
  const music = musicParser(post.clips_metadata);

  const type = getMediaType(post.media_type, post.product_type);

  return {
    externalId: postId,
    platform: "instagram",
    kind: "post",
    url,
    createdAt: new Date(post.taken_at * 1000),
    caption: text,
    metadata: {
      likes: post.like_count,
      play: post.play_count,
      view: post.view_count,
      location,
      music,
      code: post.code,
      type: type,
    },
  };
}

function getMediaType(media_type: number, product_type: MediaProductType) {
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
