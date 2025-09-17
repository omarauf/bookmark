import z from "zod";
import { UserPlatformTypeEnum } from "../common/platform-type";
import { UserSchema } from "../user";

export const TwitterUserSchema = UserSchema.extend({
  type: z.literal(UserPlatformTypeEnum["twitter-user"]),
});

export const CreateTwitterUserSchema = TwitterUserSchema.omit({
  _id: true,
  id: true,
  importedAt: true,
  updatedAt: true,
  downloadedAt: true,
  deletedAt: true,
});

export type TwitterUser = z.infer<typeof TwitterUserSchema>;
export type CreateTwitterUser = z.infer<typeof CreateTwitterUserSchema>;
