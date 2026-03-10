import { UserPlatformTypeEnum } from "@workspace/contracts/platform-type";
import type { TiktokUser } from "@workspace/contracts/tiktok/user";
import { Schema } from "@/services/database/mongoose";
import { UserModel, userSchemaOptions } from "../../base/models/user";

const TiktokUserSchema = new Schema<TiktokUser>({}, userSchemaOptions);

export const TiktokUserModel = UserModel.discriminator(
  UserPlatformTypeEnum["tiktok-user"],
  TiktokUserSchema,
);
