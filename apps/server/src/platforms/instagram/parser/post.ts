import type { CreateInstagramPost } from "@workspace/contracts/instagram";
import type { Media, MediaProductType } from "@workspace/contracts/raw/instagram";
import { creatorParser } from "./creator";
import { creatorTagParser } from "./creator-tag";
import { locationParser } from "./location";
import { mediaParser } from "./media";
import { musicParser } from "./music";

export function postParser(post: Media): CreateInstagramPost {
  const creator = creatorParser(post.owner);
  const postId = post.id;
  const url = `https://www.instagram.com/p/${post.code}`;
  const text = post.caption?.text;
  const media = mediaParser(post);
  const location = locationParser(post.location);
  const music = musicParser(post.clips_metadata);

  const creatorTags = creatorTagParser(post.usertags);

  const type = getMediaType(post.media_type, post.product_type);

  return {
    externalId: postId,
    url,
    createdAt: new Date(post.taken_at * 1000),
    creator: creator,
    externalCreatorId: creator.externalId,
    likes: post.like_count,
    play: post.play_count,
    view: post.view_count,
    caption: text,
    location,
    music,
    taggedCreators: creatorTags,
    media,
    platform: "instagram",
    collectionId: undefined,
    tags: [],
    code: post.code,
    type: type,
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
