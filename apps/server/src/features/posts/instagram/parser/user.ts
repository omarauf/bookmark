import type { CoauthorProducer, Owner } from "@workspace/contracts/instagram/raw";
import type { ParsedInstagramUser } from "@workspace/contracts/instagram/user";

export function userParser(user: Owner | CoauthorProducer): ParsedInstagramUser {
  const userId = user.id;
  const username = user.username;
  const name = user.full_name;
  const profilePicture = user.profile_pic_url;
  const url = `https://www.instagram.com/${username}/`;
  return {
    userId,
    username,
    name,
    url,
    profilePicture,
  };
}
