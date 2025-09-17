import { ORPCError } from "@orpc/server";
import type { CreateTwitterPost, TwitterPost } from "@workspace/contracts/twitter/post";
import { TwitterPostModel } from "../models/post";
import type { ParsedTwitterPost } from "../parser/schema";
import { getImagePath, getVideoPath } from "../utils";

export async function mapTwitterPosts(data: ParsedTwitterPost[], userMap: Map<string, string>) {
  const existingPosts: TwitterPost[] = await TwitterPostModel.find({
    postId: { $in: data.map((post) => post.postId) },
  });

  const existingPostIds = new Set(existingPosts.map((post) => post.postId));
  const postsToInsert = data.filter((post) => !existingPostIds.has(post.postId));

  const mappedPosts = postsToInsert.map((post) => mapToDocument(post, userMap));

  return await TwitterPostModel.insertMany(mappedPosts);
}

function mapToDocument(post: ParsedTwitterPost, userMap: Map<string, string>): CreateTwitterPost {
  // Convert creator to ObjectId reference
  const creator = userMap.get(post.creator.userId);

  if (creator === undefined) {
    throw new ORPCError("BAD_REQUEST", {
      message: `User with ID ${post.creator.userId} not found`,
    });
  }

  let quoted: CreateTwitterPost["quoted"] | undefined;
  if (post.quoted) {
    const quotedCreator = userMap.get(post.quoted.creator.userId);
    if (quotedCreator === undefined) {
      throw new ORPCError("BAD_REQUEST", {
        message: `User with ID ${post.quoted.creator.userId} not found`,
      });
    }
    quoted = { ...post.quoted, creator: quotedCreator };

    quoted.media.forEach((m, i) => {
      if (m.mediaType === "image") {
        m.url = getImagePath("image", `${quoted?.postId}-${i}`);
      } else if (m.mediaType === "video") {
        m.url = getVideoPath("video", `${quoted?.postId}-${i}`);
        m.thumbnail = getImagePath("video", `${quoted?.postId}-${i}`);
      } else {
        m.url = getVideoPath("video", `${quoted?.postId}-${i}`);
        m.thumbnail = getImagePath("video", `${quoted?.postId}-${i}`);
      }
    });
  }

  post.media.forEach((m, i) => {
    if (m.mediaType === "image") {
      m.url = getImagePath("image", `${post.postId}-${i}`);
    } else if (m.mediaType === "video") {
      m.url = getVideoPath("video", `${post.postId}-${i}`);
      m.thumbnail = getImagePath("video", `${post.postId}-${i}`);
    } else {
      m.url = getVideoPath("video", `${post.postId}-${i}`);
      m.thumbnail = getImagePath("video", `${post.postId}-${i}`);
    }
  });

  return {
    ...post,
    quoted,
    type: "twitter-post",
    creator: creator,
    tags: [],
    collections: [],
  };
}
