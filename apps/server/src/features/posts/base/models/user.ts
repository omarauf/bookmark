import type { User } from "@workspace/contracts/user";
import { model, Schema } from "@/services/database/mongoose";

export const userSchemaOptions = {
  collection: "users",
  timestamps: {
    createdAt: "importedAt",
    updatedAt: "updatedAt",
  },
  discriminatorKey: "type",
};

const userSchema = new Schema<User>(
  {
    userId: { type: String, required: true },
    url: { type: String, required: true },
    username: { type: String, required: true },
    name: { type: String },
    profilePicture: { type: String, required: false },
    favorite: { type: Boolean, required: false },
    deletedAt: { type: Date, required: false },
  },
  userSchemaOptions,
);

export const UserModel = model("User", userSchema);
