import type { Link } from "@workspace/contracts/views/link";
import type { ItemEntity } from "@/modules/item/schema";
import { replaceNullWithUndefined } from "@/utils/object";

type RawItem = ItemEntity & {
  collections?: {
    createdAt: Date;
    collectionId: string;
    itemId: string;
    collection: {
      id: string;
      color: string;
    };
  }[];
  tags?: {
    createdAt: Date;
    itemId: string;
    tagId: string;
    tag: {
      id: string;
      name: string;
      color: string;
    };
  }[];
};

export function mapItemToLink(item: RawItem): Link {
  const normalizedItem = replaceNullWithUndefined(item);

  const collectionIds = item.collections?.map((c) => c.collection.id);
  const tagIds = item.tags?.map((t) => t.tag.id);

  const link: Link = {
    id: normalizedItem.id,
    createdAt: normalizedItem.createdAt,
    updatedAt: normalizedItem.updatedAt,
    url: normalizedItem.url,
    caption: normalizedItem.caption,
    deletedAt: normalizedItem.deletedAt,
    preview: undefined,
    path: "",
    collectionIds: collectionIds || [],
    tagIds: tagIds || [],
    note: normalizedItem.note,
    rate: normalizedItem.rate,
    favorite: normalizedItem.favorite,
    externalId: normalizedItem.externalId,
    kind: normalizedItem.metadata?.kind,
    metadata: normalizedItem.metadata,
    platform: normalizedItem.platform,
  };

  if (item.metadata.kind === "link") {
    link.path = item.metadata.path || "";
    link.preview = item.metadata.preview;
  }

  return link;
}
