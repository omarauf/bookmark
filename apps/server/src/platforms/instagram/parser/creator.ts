import type { CreateInstagramCreator } from "@workspace/contracts/instagram";
import type { CoauthorProducer, Owner } from "@workspace/contracts/raw/instagram";

export function creatorParser(user: Owner | CoauthorProducer): CreateInstagramCreator {
  const userId = user.id;
  const username = user.username;
  const name = user.full_name;
  const profilePicture = user.profile_pic_url;
  const url = `https://www.instagram.com/${username}/`;
  const verified = user.is_verified;

  return {
    externalId: userId,
    username,
    name,
    url,
    avatar: profilePicture,
    verified,
    platform: "instagram",
  };
}
