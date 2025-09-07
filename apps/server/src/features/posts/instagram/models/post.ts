import type { InstagramPostEntity } from "@workspace/contracts/instagram/post";
import { PostPlatformTypeEnum } from "@workspace/contracts/platform-type";
import { Schema } from "@/services/database/mongoose";
import { PostModel, postSchemaOptions } from "../../base/models/post";

const UserTagSchema = new Schema<InstagramPostEntity["userTags"][number]>(
  {
    x: { type: Number },
    y: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { _id: false }, // optional: prevent creating _id for each sub-document
);

const InstagramPostSchema = new Schema<InstagramPostEntity>(
  {
    likes: { type: Number, required: true },
    media: { type: Schema.Types.Mixed, required: true },
    caption: { type: String, required: false },
    location: { type: Schema.Types.Mixed, required: false },
    userTags: { type: [UserTagSchema], required: false },
    music: { type: Schema.Types.Mixed, required: false },
  },
  postSchemaOptions,
);

export const InstagramPostModel = PostModel.discriminator(
  PostPlatformTypeEnum["instagram-post"],
  InstagramPostSchema,
);
