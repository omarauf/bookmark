import type { CreateTiktokUser, TiktokUser } from "@workspace/contracts/tiktok/user";
import { TiktokUserModel } from "../models/user";
import type { ParsedTiktokPost, ParsedTiktokUser } from "../schemas";
import { getImagePath } from "../utils";

export async function mapTiktokUsers(data: ParsedTiktokPost[]) {
  const parsedUsers: ParsedTiktokUser[] = data.flatMap((post) => post.creator);
  const uniqueUsers = Array.from(new Map(parsedUsers.map((user) => [user.userId, user])).values());

  const existingUsers: TiktokUser[] = await TiktokUserModel.find({
    userId: { $in: uniqueUsers.map((user) => user.userId) },
  });

  const existingUserIds = new Set(existingUsers.map((user) => user.userId));

  const userToInsert = uniqueUsers.filter((user) => !existingUserIds.has(user.userId));

  const mappedUsers: CreateTiktokUser[] = userToInsert.map((user) => ({
    ...user,
    type: "tiktok-user",
    profilePicture: getImagePath("user", user.username),
  }));

  const createdUsers = await TiktokUserModel.insertMany(mappedUsers);
  return {
    createdUsers,
    userMap: new Map([...existingUsers, ...createdUsers].map((user) => [user.userId, user._id])),
  };
}
