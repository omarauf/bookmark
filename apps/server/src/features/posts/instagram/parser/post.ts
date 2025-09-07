import type { ParsedInstagramPost } from "@workspace/contracts/instagram/post";
import type { Media } from "@workspace/contracts/instagram/raw";
import { locationParser } from "./location";
import { mediaParser } from "./media";
import { musicParser } from "./music";
import { userParser } from "./user";
import { userTagParser } from "./user-tag";

export function postParser(post: Media): ParsedInstagramPost {
  const user = userParser(post.owner);
  const postId = post.id;
  const url = `https://www.instagram.com/p/${post.code}`;
  const text = post.caption?.text;
  const media = mediaParser(post);
  const location = locationParser(post.location);
  const music = musicParser(post.clips_metadata);

  const userTags = userTagParser(post.usertags);

  return {
    postId,
    url,
    createdAt: new Date(post.taken_at * 1000),
    creator: user,
    likes: post.like_count,
    caption: text,
    location,
    music,
    userTags,
    media,
  };
}
