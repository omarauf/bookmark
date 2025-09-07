import { ORPCError } from "@orpc/server";
import type {
  CreateInstagramPost,
  InstagramPost,
  ParsedInstagramPost,
} from "@workspace/contracts/instagram/post";
import { InstagramPostModel } from "../models/post";
import { getImagePath, getVideoPath } from "../utils";

export async function mapInstagramPosts(data: ParsedInstagramPost[], userMap: Map<string, string>) {
  const existingPosts: InstagramPost[] = await InstagramPostModel.find({
    postId: { $in: data.map((post) => post.postId) },
  });

  const existingPostIds = new Set(existingPosts.map((post) => post.postId));
  const postsToInsert = data.filter((post) => !existingPostIds.has(post.postId));

  const mappedPosts = postsToInsert.map((post) => mapToDocument(post, userMap));

  return await InstagramPostModel.insertMany(mappedPosts);
}

function mapToDocument(
  post: ParsedInstagramPost,
  userMap: Map<string, string>,
): CreateInstagramPost {
  // Convert creator to ObjectId reference
  const creator = userMap.get(post.creator.userId);

  if (creator === undefined) {
    throw new ORPCError("BAD_REQUEST", {
      message: `User with ID ${post.creator.userId} not found`,
    });
  }

  // Convert userTags to ObjectId references
  const userTags = post.userTags.map((userTag) => {
    const user = userMap.get(userTag.user.userId);
    if (user === undefined) {
      throw new ORPCError("BAD_REQUEST", {
        message: `User with ID ${userTag.user.userId} not found`,
      });
    }
    return { ...userTag, user: user };
  });

  // Convert media url
  if (post.media.mediaType === "image") {
    post.media.url = getImagePath("image", post.postId);
  }

  if (post.media.mediaType === "video") {
    post.media.url = getVideoPath("video", post.postId);
    post.media.thumbnail = getImagePath("video", post.postId);
  }

  if (post.media.mediaType === "carousel") {
    post.media.media.forEach((m, i) => {
      if (m.mediaType === "image") {
        m.url = getImagePath("carousel", `${post.postId}-${i}`);
      } else {
        m.url = getVideoPath("carousel", `${post.postId}-${i}`);
        m.thumbnail = getImagePath("carousel", `${post.postId}-${i}`);
      }
    });
  }

  return {
    ...post,
    type: "instagram-post",
    creator: creator,
    userTags: userTags,
    tags: [],
    collections: [],
  };
}
