import type { ParsedInstagramPost } from "@workspace/contracts/instagram/post";
import type {
  CreateInstagramUser,
  InstagramUser,
  ParsedInstagramUser,
} from "@workspace/contracts/instagram/user";
import { InstagramUserModel } from "../models/user";
import { getImagePath } from "../utils";

export async function mapInstagramUsers(data: ParsedInstagramPost[]) {
  const parsedUsers: ParsedInstagramUser[] = data.flatMap((post) => [
    post.creator,
    ...post.userTags.map((userTag) => userTag.user),
  ]);
  const uniqueUsers = Array.from(new Map(parsedUsers.map((user) => [user.userId, user])).values());

  const existingUsers: InstagramUser[] = await InstagramUserModel.find({
    userId: { $in: uniqueUsers.map((user) => user.userId) },
  });

  const existingUserIds = new Set(existingUsers.map((user) => user.userId));

  const userToInsert = uniqueUsers.filter((user) => !existingUserIds.has(user.userId));

  const mappedUsers: CreateInstagramUser[] = userToInsert.map((user) => ({
    ...user,
    type: "instagram-user",
    profilePicture: getImagePath("user", user.username),
  }));

  const createdUsers = await InstagramUserModel.insertMany(mappedUsers);
  return {
    createdUsers,
    userMap: new Map([...existingUsers, ...createdUsers].map((user) => [user.userId, user._id])),
  };
}
