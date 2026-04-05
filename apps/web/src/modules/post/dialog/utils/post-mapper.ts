import type { UpdateItem } from "@workspace/contracts/item";
import type { Post } from "@workspace/contracts/post";

export function postToUpdate(post: Post): UpdateItem {
  return {
    id: post.id,
    note: post.note,
    rate: post.rate,
    tagIds: [],
    collectionId: post.collectionId,
    favorite: post.favorite,
  };
}
