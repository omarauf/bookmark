import type { Profile } from "@workspace/contracts/views/profile";
import type { ItemEntity } from "@/modules/item/schema";
import { replaceNullWithUndefined } from "@/utils/object";

type RawItem = ItemEntity;

export function mapItemToProfile(
  item: RawItem & { postCount?: number; tagCount?: number },
): Profile {
  const normalizedItem = replaceNullWithUndefined(item);

  const profile: Profile = {
    id: normalizedItem.id,
    createdAt: normalizedItem.createdAt,
    updatedAt: normalizedItem.updatedAt,
    url: normalizedItem.url,
    caption: normalizedItem.caption,
    deletedAt: normalizedItem.deletedAt,
    note: normalizedItem.note,
    rate: normalizedItem.rate,
    favorite: normalizedItem.favorite,
    externalId: normalizedItem.externalId,
    kind: "profile",
    platform: normalizedItem.platform,
    avatar: `${item.platform}/avatar/${item.externalId}.jpg`,
    collectionIds: [],
    name: "",
    username: "",
    tagIds: [],
    postCount: Number(item.postCount) ?? 0,
    tagCount: Number(item.tagCount) ?? 0,
  };

  if (item.metadata.kind === "profile") {
    profile.name = item.metadata.name || "";
    profile.username = item.metadata.username || "";
  }

  return profile;
}
