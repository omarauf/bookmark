import type { Post } from "@workspace/contracts/post";
import type { ItemEntity } from "@/modules/item/schema";
import type { Media } from "@/modules/media/schema";
import { normalizeMedia } from "@/modules/media/service";
import type { RelationEntity } from "@/modules/relation/schema";

type RawItem = ItemEntity & {
  media: Media[];
  outgoing: (RelationEntity & {
    toItem: ItemEntity & {
      media: Media[];
    };
  })[];
};

export function mapItemToPost(item: RawItem): Post {
  const creator = item.outgoing.find((r) => r.relationType === "created_by")?.toItem;

  if (!creator) {
    throw new Error(`Creator not found for item ${item.id}`);
  }

  const taggedItem = item.outgoing
    .filter((r) => r.relationType === "tagged")
    .map((r) => ({ ...mapProfile(r.toItem), x: r.x, y: r.y }));

  return {
    ...mapItem(item),
    creator: mapProfile(creator),
    media: normalizeMedia(item.media),
    taggedItems: taggedItem,
  };
}

function mapItem(item: ItemEntity & { media: Media[] }) {
  return {
    ...item,
    media: normalizeMedia(item.media),
    collectionId: undefined,
    tags: [],
    note: item.note ?? undefined,
    rate: item.rate ?? undefined,
    caption: item.caption ?? undefined,
    deletedAt: item.deletedAt ?? undefined,
    createdAt: item.createdAt,
    favorite: item.favorite ?? undefined,
    metadata: item.metadata ?? undefined,
    updatedAt: item.updatedAt,
    externalId: item.externalId,
    kind: item.kind,
    platform: item.platform,
    url: item.url,
  };
}

function mapProfile(item: ItemEntity & { media: Media[] }) {
  return {
    ...mapItem(item),
    name: "",
    username: "",
    // media: normalizeMedia(item.media)[0],
    avatar: `${item.platform}/avatar/${item.externalId}.jpg`,
  };
}
