import type { Youtube } from "@workspace/contracts/views/youtube";
import type { ItemEntity } from "../item/schema";
import type { Media } from "../media/schema";
import { normalizeMedia } from "../media/service";

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
  media?: Media[];
};

export function mapItemToYoutube(items: RawItem[]): Youtube[] {
  const youtubeArr: Youtube[] = [];

  for (const item of items) {
    if (item.platform !== "youtube" || item.metadata?.platform !== "youtube") {
      continue;
    }

    const collectionIds = item.collections?.map((c) => c.collection.id);
    const tagIds = item.tags?.map((t) => t.tag.id);

    youtubeArr.push({
      ...item.metadata,
      id: item.id,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      url: item.url,
      caption: item.caption ?? undefined,
      deletedAt: item.deletedAt ?? undefined,
      externalId: item.externalId,
      favorite: item.favorite ?? undefined,
      note: item.note ?? undefined,
      rate: item.rate ?? undefined,
      collectionIds: collectionIds || [],
      tagIds: tagIds || [],
      media: normalizeMedia(item.media) ?? [],
    });
  }

  return youtubeArr;
}
