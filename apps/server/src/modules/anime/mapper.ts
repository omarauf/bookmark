import type { AnimeItem } from "@workspace/contracts/anime-view";
import type { ItemEntity } from "@/modules/item/schema";

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

export function mapItemToAnime(items: RawItem[]): AnimeItem[] {
  const animeArr: AnimeItem[] = [];

  for (const item of items) {
    if (item.platform !== "mal" || item.metadata?.platform !== "mal") {
      continue;
    }

    const collectionIds = item.collections?.map((c) => c.collection.id);
    const tagIds = item.tags?.map((t) => t.tag.id);

    animeArr.push({
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

  return animeArr;
}
