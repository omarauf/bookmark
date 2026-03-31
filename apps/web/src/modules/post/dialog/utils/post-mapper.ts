import type { Post, UpdatePost } from "@workspace/contracts/post";

export function postToUpdate(post: Post): UpdatePost {
  return {
    id: post.id,
    note: post.note,
    rate: post.rate,
    // tags: post.tags.map((t) => t.id),
    // collections: post.collections.map((c) => c.id),
    tagIds: [],
    collectionIds: [],
    favorite: post.favorite,
  };
}
