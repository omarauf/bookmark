import { UserPlatformTypeEnum } from "@workspace/contracts/platform-type";
import type { TwitterUser } from "@workspace/contracts/twitter/user";
import { Schema } from "@/services/database/mongoose";
import { UserModel, userSchemaOptions } from "../../base/models/user";

const TwitterUserSchema = new Schema<TwitterUser>({}, userSchemaOptions);

export const TwitterUserModel = UserModel.discriminator(
  UserPlatformTypeEnum["twitter-user"],
  TwitterUserSchema,
);
