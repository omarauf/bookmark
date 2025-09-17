import { PostPlatformTypeEnum } from "@workspace/contracts/platform-type";
import type { TwitterPost } from "@workspace/contracts/twitter/post";
import { Schema } from "@/services/database/mongoose";
import { PostModel, postSchemaOptions } from "../../base/models/post";

const QuotedTwitterPostSchema = new Schema<TwitterPost["quoted"]>(
  {
    postId: { type: String, required: true },
    url: { type: String, required: true },
    caption: { type: String, required: false },
    media: { type: Schema.Types.Mixed, default: [] },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    quotes: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    retweets: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    imageDescription: { type: String, required: false },
    videoDescription: { type: String, required: false },
    createdAt: { type: Date, required: false },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { _id: false },
);

const TwitterPostSchema = new Schema<TwitterPost>(
  {
    caption: { type: String, required: false },
    media: { type: Schema.Types.Mixed, default: [] },
    likes: { type: Number, default: 0 },
    quotes: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    retweets: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    quoted: { type: QuotedTwitterPostSchema, required: false },
  },
  postSchemaOptions,
);

export const TwitterPostModel = PostModel.discriminator(
  PostPlatformTypeEnum["twitter-post"],
  TwitterPostSchema,
);
