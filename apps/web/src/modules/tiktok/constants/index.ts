import type { UpdatePost } from "@workspace/contracts/post";

export const DEFAULT_POST: UpdatePost = {
  id: "",
  collectionIds: [],
  tagIds: [],
  favorite: undefined,
  note: undefined,
  rate: undefined,
};
