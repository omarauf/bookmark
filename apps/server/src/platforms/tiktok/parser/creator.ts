import type { Author } from "@workspace/contracts/raw/tiktok";
import type { CreateTiktokCreator } from "@workspace/contracts/tiktok";

export function creatorParser(author: Author): CreateTiktokCreator {
  const user = author;

  const userId = user.id;
  const username = user.uniqueId;
  const name = user.nickname;
  const profilePicture = user.avatarLarger;
  const url = `https://tiktok.com/@${username}`;
  const verified = user.verified;

  return {
    externalId: userId,
    username,
    name,
    url,
    avatar: profilePicture,
    createdAt: undefined,
    verified,
    platform: "tiktok",
    // TODO: add user stats
  };
}
