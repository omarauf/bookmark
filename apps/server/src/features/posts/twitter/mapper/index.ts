import type { ParsedTwitterPost } from "../schemas";
import { mapTwitterPosts } from "./post";
import { mapTwitterUsers } from "./user";

export async function mapTwitter(data: ParsedTwitterPost[]) {
  const { createdUsers, userMap } = await mapTwitterUsers(data);
  const createdPosts = await mapTwitterPosts(data, userMap);

  return {
    mappedUsers: createdUsers.length,
    mappedPosts: createdPosts.length,
  };
}
