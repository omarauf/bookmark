import type { Author } from "@workspace/contracts/tiktok/raw";
import type { ParsedTiktokUser } from "../schemas";

export function userParser(author: Author): ParsedTiktokUser {
  const user = author;

  const userId = user.id;
  const username = user.uniqueId;
  const name = user.nickname;
  const profilePicture = user.avatarLarger;
  const url = `https://tiktok.com/@${username}`;
  const verified = user.verified;

  return {
    userId,
    username,
    name,
    url,
    profilePicture,
    createdAt: undefined,
    verified,
    // TODO: add user stats
  };
}
