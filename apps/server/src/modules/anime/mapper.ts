import type { Anime } from "@workspace/contracts/views/anime";
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

export function mapItemToAnime(items: RawItem[]): Anime[] {
  const animeArr: Anime[] = [];

  for (const item of items) {
    if (item.platform !== "mal" || item.metadata?.platform !== "mal") {
      continue;
    }

    const collectionIds = item.collections?.map((c) => c.collection.id);
    const tagIds = item.tags?.map((t) => t.tag.id);

    animeArr.push({
      ...item.metadata,
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
      collectionIds: collectionIds || [],
      tagIds: tagIds || [],
    });
  }

  return animeArr;
}
