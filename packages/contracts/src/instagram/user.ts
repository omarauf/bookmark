import z from "zod";
import { UserPlatformTypeEnum } from "../common/platform-type";
import { UserSchema } from "../user";

export const InstagramUserSchema = UserSchema.extend({
  type: z.literal(UserPlatformTypeEnum["instagram-user"]),
});

export const CreateInstagramUserSchema = InstagramUserSchema.omit({
  _id: true,
  id: true,
  importedAt: true,
  updatedAt: true,
  downloadedAt: true,
  deletedAt: true,
});

export const ParsedInstagramUserSchema = z.object({
  userId: z.string(),
  url: z.url(),
  username: z.string(),
  profilePicture: z.string().optional(),
  name: z.string().optional(),
});

export type ParsedInstagramUser = z.infer<typeof ParsedInstagramUserSchema>;
export type InstagramUser = z.infer<typeof InstagramUserSchema>;
export type CreateInstagramUser = z.infer<typeof CreateInstagramUserSchema>;
