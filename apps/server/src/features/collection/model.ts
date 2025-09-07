import type { Collection } from "@workspace/contracts/collection";
import { model, Schema } from "@/services/database/mongoose";

const collectionSchema = new Schema<Collection>(
  {
    name: { type: String, required: true },
    color: { type: String, required: true },
  },
  {
    collection: "collections",
    timestamps: true,
  },
);

export const CollectionModel = model("Collection", collectionSchema);
