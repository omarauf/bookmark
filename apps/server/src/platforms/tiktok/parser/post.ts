import type { ItemList } from "@workspace/contracts/raw/tiktok";
import type { CreateTiktokPost } from "@workspace/contracts/tiktok";
import { creatorParser } from "./creator";
import { mediaParser } from "./media";
import { musicParser } from "./music";

export function postParser(post: ItemList): CreateTiktokPost {
  const postId = post.id;
  const createdAt = new Date(post.createTime * 1000);
  const caption = post.desc;
  const creator = creatorParser(post.author);
  const url = `https://tiktok.com/@${creator.username}/video/${postId}`;
  const media = mediaParser(post);
  const music = musicParser(post.music);

  return {
    externalId: postId,
    url,
    createdAt,
    creator,
    media,
    music,
    caption,
    likes: post.stats.diggCount,
    externalCreatorId: creator.externalId,
    comments: post.stats.commentCount,
    shares: post.stats.shareCount,
    plays: post.stats.playCount,
    collects: post.stats.collectCount,
    collectionId: undefined,
    tags: [],
    platform: "tiktok",
  };
}
