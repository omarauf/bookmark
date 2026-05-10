import type { Post } from "@workspace/contracts/views/post";
import type { CollectionEntity, CollectionItemEntity } from "@/modules/collection/schema";
import type { ItemEntity } from "@/modules/item/schema";
import type { Media } from "@/modules/media/schema";
import { normalizeMedia } from "@/modules/media/service";
import type { RelationEntity } from "@/modules/relation/schema";
import { replaceNullWithUndefined } from "@/utils/object";

type RawItem = ItemEntity & {
  media: Media[];
  outgoing: (RelationEntity & {
    toItem: ItemEntity & {
      media: Media[];
    };
  })[];
  collections: (CollectionItemEntity & { collection: CollectionEntity })[];
  tags: { tag: { id: string; name: string; color: string; createdAt: Date; updatedAt: Date } }[];
};

export function mapItemToPost(item: RawItem): Post {
  const creator = item.outgoing.find((r) => r.relationType === "created_by")?.toItem;

  if (!creator) {
    throw new Error(`Creator not found for item ${item.id}`);
  }

  const taggedItem = item.outgoing
    .filter((r) => r.relationType === "tagged")
    .map((r) => ({ ...mapProfile(r.toItem), x: r.x, y: r.y }));

  const normalizedItem = replaceNullWithUndefined(item);

  if (item.kind !== "post" || item.metadata?.kind !== "post") {
    throw new Error(`Item ${item.id} is not an Instagram post`);
  }

  return {
    ...normalizedItem,
    ...item.metadata,
    creator: mapProfile(creator),
    media: normalizeMedia(item.media),
    taggedItems: taggedItem,
    collections: mapCollection(item.collections),
    collectionIds: item.collections.map((c) => c.collection.id),
    tags: item.tags.map((t) => t.tag),
    tagIds: item.tags.map((t) => t.tag.id),
  };
}

function mapProfile(item: ItemEntity & { media: Media[] }) {
  const normalizedItem = replaceNullWithUndefined(item);

  const profile: Post["creator"] = {
    ...normalizedItem,
    name: "",
    username: "",
    avatar: `${item.platform}/avatar/${item.externalId}.jpg`,
    collectionIds: [],
    tagIds: [],
    kind: "profile",
  };

  if (normalizedItem.metadata.kind === "profile") {
    profile.name = normalizedItem.metadata.name || "";
    profile.username = normalizedItem.metadata.username || "";
  }

  return profile;
}

function mapCollection(collections: RawItem["collections"]) {
  return collections.map((c) => ({
    id: c.collection.id,
    label: c.collection.label,
    color: c.collection.color,
    slug: c.collection.slug,
    path: c.collection.path,
  }));
}
