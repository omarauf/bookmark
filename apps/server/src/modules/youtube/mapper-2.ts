import type { YoutubeItem } from "@workspace/contracts/views/youtube";
import type { ItemEntity } from "../item/schema";

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

export function mapItemToYoutube(items: RawItem[]): YoutubeItem[] {
  const youtubeArr: YoutubeItem[] = [];

  for (const item of items) {
    if (item.platform !== "youtube" || item.metadata?.platform !== "youtube") {
      continue;
    }

    const collectionIds = item.collections?.map((c) => c.collection.id);
    const tagIds = item.tags?.map((t) => t.tag.id);

    youtubeArr.push({
      id: item.id,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      url: item.url,
      caption: item.caption ?? undefined,
      deletedAt: item.deletedAt ?? undefined,
      externalId: item.externalId,
      kind: item.metadata?.kind,
      platform: item.platform,
      favorite: item.favorite ?? undefined,
      note: item.note ?? undefined,
      rate: item.rate ?? undefined,
      metadata: item.metadata ?? undefined,
      collectionIds: collectionIds || [],
      tagIds: tagIds || [],
    });
  }

  return youtubeArr;
}
