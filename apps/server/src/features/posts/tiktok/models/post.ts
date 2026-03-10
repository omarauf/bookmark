import { PostPlatformTypeEnum } from "@workspace/contracts/platform-type";
import type { TiktokPost } from "@workspace/contracts/tiktok/post";
import { Schema } from "@/services/database/mongoose";
import { PostModel, postSchemaOptions } from "../../base/models/post";

const TiktokMusicSchema = new Schema<TiktokPost["music"]>(
  {
    album: { type: String },
    authorName: { type: String },
    original: { type: Boolean },
    duration: { type: Number },
    id: { type: String },
    title: { type: String },
    cover: { type: String },
    url: { type: String },
  },
  { _id: false }, // optional: prevent creating _id for each sub-document
);

const TiktokPostSchema = new Schema<TiktokPost>(
  {
    media: { type: Schema.Types.Mixed, default: [] },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    plays: { type: Number, default: 0 },
    collects: { type: Number, default: 0 },
    music: { type: TiktokMusicSchema, required: true },
  },
  postSchemaOptions,
);

export const TiktokPostModel = PostModel.discriminator(
  PostPlatformTypeEnum["tiktok-post"],
  TiktokPostSchema,
);
