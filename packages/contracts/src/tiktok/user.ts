import z from "zod";
import { UserPlatformTypeEnum } from "../common/platform-type";
import { UserSchema } from "../user";

export const TiktokUserSchema = UserSchema.extend({
  type: z.literal(UserPlatformTypeEnum["tiktok-user"]),
});

export const CreateTiktokUserSchema = TiktokUserSchema.omit({
  _id: true,
  id: true,
  importedAt: true,
  updatedAt: true,
  downloadedAt: true,
  deletedAt: true,
});

export type TiktokUser = z.infer<typeof TiktokUserSchema>;
export type CreateTiktokUser = z.infer<typeof CreateTiktokUserSchema>;
