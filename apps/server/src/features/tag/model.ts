import type { Tag } from "@workspace/contracts/tag";
import { model, Schema } from "@/services/database/mongoose";

const tagSchema = new Schema<Tag>(
  {
    name: { type: String, required: true },
    color: { type: String },
  },
  {
    collection: "tags",
    timestamps: true,
  },
);

export const TagModel = model<Tag>("Tag", tagSchema);
