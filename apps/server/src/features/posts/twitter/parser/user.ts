import type {
  FluffyUserResults,
  PurpleUserResults,
  StickyUserResults,
} from "@workspace/contracts/twitter/raw";
import type { ParsedTwitterUser } from "../schemas";

export function userParser(
  user: FluffyUserResults | PurpleUserResults | StickyUserResults,
): ParsedTwitterUser {
  const userId = user.result.id;
  const username = user.result.core.screen_name;
  const name = user.result.core.name;
  const profilePicture = user.result.avatar.image_url;
  const createdAt = new Date(user.result.core.created_at);
  const url = `https://x.com/${username}`;
  const verified = user.result.is_blue_verified;
  const location = user.result.location.location || undefined;

  return {
    userId,
    username,
    name,
    url,
    profilePicture,
    createdAt,
    verified,
    location,
  };
}
