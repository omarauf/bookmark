import type { UpdatePost } from "@workspace/contracts/post";

export const DEFAULT_POST: UpdatePost = {
  id: "",
  collections: [],
  tags: [],
  favorite: undefined,
  note: undefined,
  rate: undefined,
};
