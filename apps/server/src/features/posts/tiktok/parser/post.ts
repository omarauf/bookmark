import type { ItemList } from "@workspace/contracts/tiktok/raw";
import type { ParsedTiktokPost } from "../schemas";
import { mediaParser } from "./media";
import { musicParser } from "./music";
import { userParser } from "./user";

export function postParser(post: ItemList): ParsedTiktokPost {
  const postId = post.id;
  const createdAt = new Date(post.createTime * 1000);
  const caption = post.desc;
  const creator = userParser(post.author);
  const url = `https://tiktok.com/@${creator.username}/video/${postId}`;
  const media = mediaParser(post);
  const music = musicParser(post.music);

  return {
    postId,
    url,
    createdAt,
    creator,
    media,
    music,
    caption,
    likes: post.stats.diggCount,
    comments: post.stats.commentCount,
    shares: post.stats.shareCount,
    plays: post.stats.playCount,
    collects: post.stats.collectCount,
  };
}
