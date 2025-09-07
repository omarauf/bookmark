import type { PostEntity } from "@workspace/contracts/post";
import { CollectionModel } from "@/features/collection/model";
import { TagModel } from "@/features/tag/model";
import { model, Schema } from "@/services/database/mongoose";
import { UserModel } from "./user";

export const postSchemaOptions = {
  collection: "posts",
  timestamps: {
    createdAt: "importedAt",
    updatedAt: "updatedAt",
  },
  discriminatorKey: "type",
};

const postSchema = new Schema<PostEntity>(
  {
    creator: { type: Schema.Types.ObjectId, ref: UserModel.modelName, required: true },
    postId: { type: String, required: true },
    url: { type: String, required: true },
    favorite: { type: Boolean, required: false },
    collections: [{ type: Schema.Types.ObjectId, ref: CollectionModel.modelName }],
    tags: [{ type: Schema.Types.ObjectId, ref: TagModel.modelName }],
    note: { type: String, required: false },
    rate: { type: Number, min: 0, max: 10, required: false },
    deletedAt: { type: Date, required: false },
    savedAt: { type: Date, required: false },
    createdAt: { type: Date, required: false },
    downloadedAt: { type: Date, required: false },
  },
  postSchemaOptions,
);

export const PostModel = model("Post", postSchema);
