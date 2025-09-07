import type { Link } from "@workspace/contracts/link";
import { model, Schema } from "@/services/database/mongoose";

const linkSchema = new Schema<Link>(
  {
    title: { type: String },
    url: { type: String, required: true },
    folder: { type: String, required: true },
    path: { type: String, required: true },
    preview: {
      type: {
        url: { type: String, required: true },
        mediaType: { type: String, required: true },
        favicons: { type: [String], default: undefined },
        title: { type: String },
        charset: { type: String },
        siteName: { type: String },
        description: { type: String },
        contentType: { type: String },
        images: { type: [String], default: undefined },
        videos: {
          type: [
            {
              url: { type: String, required: true },
              type: { type: String },
              width: { type: Number },
              height: { type: Number },
            },
          ],
          default: undefined,
        },
      },
      required: false,
    },
    deletedAt: { type: Date, required: false },
  },
  {
    collection: "links",
    timestamps: true,
  },
);

export const LinkModel = model("Link", linkSchema);
