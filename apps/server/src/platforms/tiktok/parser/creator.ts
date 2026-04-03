import type { Author } from "@workspace/contracts/raw/tiktok";
import type { CreateTiktokCreator } from "@workspace/contracts/tiktok";

export function creatorParser(author: Author): CreateTiktokCreator {
  const creator = author;

  const externalId = creator.id;
  const username = creator.uniqueId;
  const name = creator.nickname;
  const profilePicture = creator.avatarLarger;
  const url = `https://tiktok.com/@${username}`;
  const verified = creator.verified;

  return {
    externalId,
    username,
    name,
    url,
    avatar: profilePicture,
    createdAt: undefined,
    verified,
    platform: "tiktok",
    // TODO: add creator stats
  };
}
