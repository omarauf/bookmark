import { ORPCError } from "@orpc/server";
import type { CreateTiktokPost, TiktokPost } from "@workspace/contracts/tiktok/post";
import { TiktokPostModel } from "../models/post";
import type { ParsedTiktokPost } from "../schemas";
import { getImagePath, getVideoPath } from "../utils";

export async function mapTiktokPosts(data: ParsedTiktokPost[], userMap: Map<string, string>) {
  const uniqueData = Array.from(new Map(data.map((item) => [item.postId, item])).values());

  const existingPosts: TiktokPost[] = await TiktokPostModel.find({
    postId: { $in: uniqueData.map((post) => post.postId) },
  });

  const existingPostIds = new Set(existingPosts.map((post) => post.postId));
  const postsToInsert = uniqueData.filter((post) => !existingPostIds.has(post.postId));

  const mappedPosts = postsToInsert.map((post) => mapToDocument(post, userMap));

  return await TiktokPostModel.insertMany(mappedPosts);
}

function mapToDocument(post: ParsedTiktokPost, userMap: Map<string, string>): CreateTiktokPost {
  // Convert creator to ObjectId reference
  const creator = userMap.get(post.creator.userId);

  if (creator === undefined) {
    throw new ORPCError("BAD_REQUEST", {
      message: `User with ID ${post.creator.userId} not found`,
    });
  }

  post.media.forEach((m, i) => {
    if (m.mediaType === "image") {
      m.url = getImagePath("image", `${post.postId}-${i}`);
    } else if (m.mediaType === "video") {
      m.url = getVideoPath("video", `${post.postId}-${i}`);
      m.thumbnail = getImagePath("video", `${post.postId}-${i}`);
    }
  });

  if (post.music.cover) {
    post.music.cover = getImagePath("music", post.music.id);
  }
  if (post.music.url) {
    post.music.url = getVideoPath("music", post.music.id);
  }

  return {
    ...post,
    type: "tiktok-post",
    creator: creator,
    tags: [],
    collections: [],
  };
}
