import type { CreateItem } from "@workspace/contracts/item";
import type { ItemList } from "@workspace/contracts/raw/tiktok";
import { musicParser } from "./music";

export function postParser(post: ItemList): CreateItem {
  const postId = post.id;
  const createdAt = new Date(post.createTime * 1000);
  const caption = post.desc;
  const url = `https://tiktok.com/@${post.author.uniqueId}/video/${postId}`;
  const music = musicParser(post.music);

  return {
    externalId: postId,
    platform: "tiktok",
    kind: "post",
    url,
    createdAt,
    caption,
    metadata: {
      platform: "tiktok",
      kind: "post",
      music,
      likes: post.stats.diggCount,
      comments: post.stats.commentCount,
      shares: post.stats.shareCount,
      plays: post.stats.playCount,
      collects: post.stats.collectCount,
    },
  };
}
