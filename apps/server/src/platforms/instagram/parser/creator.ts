import type { CreateInstagramCreator } from "@workspace/contracts/instagram";
import type { CoauthorProducer, Owner } from "@workspace/contracts/raw/instagram";

export function creatorParser(creator: Owner | CoauthorProducer): CreateInstagramCreator {
  const externalId = creator.id;
  const username = creator.username;
  const name = creator.full_name;
  const profilePicture = creator.profile_pic_url;
  const url = `https://www.instagram.com/${username}/`;
  const verified = creator.is_verified;

  return {
    externalId,
    username,
    name,
    url,
    avatar: profilePicture,
    verified,
    platform: "instagram",
  };
}
