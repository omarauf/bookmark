import type { CreateItem } from "@workspace/contracts/item";
import type { Author } from "@workspace/contracts/raw/tiktok";

export function creatorParser(author: Author): CreateItem {
  const creator = author;

  const externalId = creator.id;
  const username = creator.uniqueId;
  const name = creator.nickname;
  const url = `https://tiktok.com/@${username}`;
  const verified = creator.verified;

  return {
    externalId,
    platform: "tiktok",
    kind: "profile",
    url,
    caption: undefined, // TODO: can we get the bio/description of the creator?
    createdAt: undefined,
    metadata: {
      platform: "tiktok",
      kind: "profile",
      username,
      name,
      verified,
      // TODO: add creator stats
    },
  };
}
