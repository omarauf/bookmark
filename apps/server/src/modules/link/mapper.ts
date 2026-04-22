import type { Link } from "@workspace/contracts/link";
import type { ItemEntity } from "@/modules/item/schema";
import { replaceNullWithUndefined } from "@/utils/object";

export function mapItemToLink(item: ItemEntity): Link {
  const a = replaceNullWithUndefined(item);

  const link: Link = {
    ...a,
    path: "",
  };

  if (item.metadata.kind === "link") {
    link.path = item.metadata.path || "";
  }

  return link;
}
