import type { ParsedTiktokPost } from "../schemas";
import { mapTiktokPosts } from "./post";
import { mapTiktokUsers } from "./user";

export async function mapTiktok(data: ParsedTiktokPost[]) {
  const { createdUsers, userMap } = await mapTiktokUsers(data);
  const createdPosts = await mapTiktokPosts(data, userMap);

  return {
    mappedUsers: createdUsers.length,
    mappedPosts: createdPosts.length,
  };
}
