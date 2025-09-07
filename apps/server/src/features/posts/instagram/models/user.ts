import type { InstagramUser } from "@workspace/contracts/instagram/user";
import { UserPlatformTypeEnum } from "@workspace/contracts/platform-type";
import { Schema } from "@/services/database/mongoose";
import { UserModel, userSchemaOptions } from "../../base/models/user";

const InstagramUserSchema = new Schema<InstagramUser>({}, userSchemaOptions);

export const InstagramUserModel = UserModel.discriminator(
  UserPlatformTypeEnum["instagram-user"],
  InstagramUserSchema,
);
