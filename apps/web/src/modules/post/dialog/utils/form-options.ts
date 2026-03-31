import { formOptions } from "@tanstack/react-form";
import type { UpdatePost } from "@workspace/contracts/post";

export const formOpts = formOptions({
  defaultValues: {
    id: "",
    collectionIds: [],
    tagIds: [],
    favorite: undefined,
    note: undefined,
    rate: undefined,
  } as UpdatePost,
});
