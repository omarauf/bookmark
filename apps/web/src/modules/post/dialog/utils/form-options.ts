import { formOptions } from "@tanstack/react-form";
import type { UpdateItem } from "@workspace/contracts/item";

export const formOpts = formOptions({
  defaultValues: {
    id: "",
    collectionIds: [],
    tagIds: [],
    favorite: undefined,
    note: undefined,
    rate: undefined,
  } as UpdateItem,
});
