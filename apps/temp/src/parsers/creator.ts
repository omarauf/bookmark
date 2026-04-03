import type { CreateItem } from "@/contracts/item";
import type { CoauthorProducer, Owner } from "@/contracts/raw/instagram";

export function creatorParser(creator: Owner | CoauthorProducer): CreateItem {
  const externalId = creator.id;
  const username = creator.username;
  const name = creator.full_name;

  const url = `https://www.instagram.com/${username}/`;
  const verified = creator.is_verified;

  return {
    externalId,
    platform: "instagram",
    kind: "profile",
    url,
    caption: undefined,
    createdAt: undefined,
    metadata: {
      username,
      name,
      verified,
    },
  };
}
