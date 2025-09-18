import type { CreateTwitterUser, TwitterUser } from "@workspace/contracts/twitter/user";
import { TwitterUserModel } from "../models/user";
import type { ParsedTwitterPost, ParsedTwitterUser } from "../schemas";
import { getImagePath } from "../utils";

export async function mapTwitterUsers(data: ParsedTwitterPost[]) {
  const parsedUsers: ParsedTwitterUser[] = data.flatMap((post) => [
    post.creator,
    ...(post.quoted ? [post.quoted.creator] : []),
  ]);
  const uniqueUsers = Array.from(new Map(parsedUsers.map((user) => [user.userId, user])).values());

  const existingUsers: TwitterUser[] = await TwitterUserModel.find({
    userId: { $in: uniqueUsers.map((user) => user.userId) },
  });

  const existingUserIds = new Set(existingUsers.map((user) => user.userId));

  const userToInsert = uniqueUsers.filter((user) => !existingUserIds.has(user.userId));

  const mappedUsers: CreateTwitterUser[] = userToInsert.map((user) => ({
    ...user,
    type: "twitter-user",
    profilePicture: getImagePath("user", user.username),
  }));

  const createdUsers = await TwitterUserModel.insertMany(mappedUsers);
  return {
    createdUsers,
    userMap: new Map([...existingUsers, ...createdUsers].map((user) => [user.userId, user._id])),
  };
}
