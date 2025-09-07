import type { ParsedInstagramPost } from "@workspace/contracts/instagram/post";
import { mapInstagramPosts } from "./post";
import { mapInstagramUsers } from "./user";

export async function mapInstagram(data: ParsedInstagramPost[]) {
  const { createdUsers, userMap } = await mapInstagramUsers(data);
  const createdPosts = await mapInstagramPosts(data, userMap);

  return {
    mappedUsers: createdUsers.length,
    mappedPosts: createdPosts.length,
  };
}
