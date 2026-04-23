import type { Link } from "@workspace/contracts/link";
import type { ItemEntity } from "@/modules/item/schema";
import { replaceNullWithUndefined } from "@/utils/object";

export function mapItemToLink(item: ItemEntity): Link {
  const normalizedItem = replaceNullWithUndefined(item);

  const link: Link = {
    id: normalizedItem.id,
    createdAt: normalizedItem.createdAt,
    updatedAt: normalizedItem.updatedAt,
    url: normalizedItem.url,
    caption: normalizedItem.caption,
    deletedAt: normalizedItem.deletedAt,
    preview: undefined,
    path: "",
  };

  if (item.metadata.kind === "link") {
    link.path = item.metadata.path || "";
    link.preview = item.metadata.preview;
  }

  return link;
}
