import type { Post, UpdatePost } from "@workspace/contracts/post";

export function postToUpdate(post: Post): UpdatePost {
  return {
    id: post.id,
    note: post.note,
    rate: post.rate,
    tagIds: [],
    collectionId: post.collectionId,
    favorite: post.favorite,
  };
}
