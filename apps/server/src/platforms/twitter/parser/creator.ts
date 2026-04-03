import type {
  FluffyUserResults,
  PurpleUserResults,
  StickyUserResults,
} from "@workspace/contracts/raw/twitter";
import type { CreateTwitterCreator } from "@workspace/contracts/twitter";

export function creatorParser(
  creator: FluffyUserResults | PurpleUserResults | StickyUserResults,
): CreateTwitterCreator {
  const externalId = creator.result.id;
  const username = creator.result.core.screen_name;
  const name = creator.result.core.name;
  const profilePicture = creator.result.avatar.image_url;
  const createdAt = new Date(creator.result.core.created_at);
  const url = `https://x.com/${username}`;
  const verified = creator.result.is_blue_verified;
  const location = creator.result.location.location || undefined;

  return {
    externalId,
    username,
    name,
    url,
    avatar: profilePicture,
    createdAt,
    verified,
    location,
    platform: "twitter",
  };
}
