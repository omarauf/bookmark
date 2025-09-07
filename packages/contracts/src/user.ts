import z from "zod";
import { ObjectIdSchema } from "./common/object-id-schema";
import { BasePaginationQuerySchema } from "./common/pagination-query";
import { UserPlatformTypeSchema } from "./common/platform-type";

const UserEntitySchema = z.object({
  _id: ObjectIdSchema,
  id: z.string(),
  userId: z.string(),
  url: z.url(),
  username: z.string(),
  type: UserPlatformTypeSchema,
  profilePicture: z.string().optional(),
  name: z.string().optional(),
  favorite: z.boolean().optional(),
  deletedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date(),
  importedAt: z.date(),
  downloadedAt: z.date().optional(),
  savedAt: z.date().optional(),
});

export const UserSchema = UserEntitySchema.extend({ _id: z.string() });

export const ListUserSchema = BasePaginationQuerySchema.extend({
  name: z.string().optional(),
  username: z.string().optional(),
});

export const CreateUserSchema = UserSchema.omit({
  _id: true,
  id: true,
  importedAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const UpdateUserSchema = UserSchema.omit({
  _id: true,
  importedAt: true,
  updatedAt: true,
  deletedAt: true,
  downloadedAt: true,
  savedAt: true,
});

export const DeleteUserSchema = UserSchema.pick({ id: true }).extend({
  hard: z.boolean().optional(),
});

export const DeleteAllUserSchema = z.object({
  hard: z.boolean().optional(),
});

export type UserEntity = z.infer<typeof UserEntitySchema>;
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type ListUsers = z.infer<typeof ListUserSchema>;
export type DeleteUser = z.infer<typeof DeleteUserSchema>;
