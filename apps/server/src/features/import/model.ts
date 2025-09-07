import type { Import } from "@workspace/contracts/import";
import { PlatformTypeEnum } from "@workspace/contracts/platform-type";
import { model, Schema } from "@/services/database/mongoose";

const ImportSchema = new Schema<Import>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: Object.values(PlatformTypeEnum), required: true },
    size: { type: Number, required: true },
    validPostCount: { type: Number, required: true },
    invalidPostCount: { type: Number, required: true },
    downloadedAt: { type: Date, required: false },
    importedAt: { type: Date, required: false },
    scrapedAt: { type: Date, required: false },
  },
  {
    collection: "imports",
    timestamps: true,
  },
);

export const ImportModel = model("Import", ImportSchema);
