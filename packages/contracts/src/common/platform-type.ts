import z from "zod";

export const PlatformTypeArray = ["instagram", "twitter"] as const;
export const PlatformTypeSchema = z.enum(PlatformTypeArray);
export type PlatformType = z.infer<typeof PlatformTypeSchema>;
export const PlatformTypeEnum = PlatformTypeSchema.enum;

export const UserPlatformTypeSchema = z.enum(["instagram-user", "twitter-user"]);
export type UserPlatformType = z.infer<typeof UserPlatformTypeSchema>;
export const UserPlatformTypeEnum = UserPlatformTypeSchema.enum;

export const PostPlatformTypeSchema = z.enum(["instagram-post", "twitter-post"]);
export type PostPlatformType = z.infer<typeof PostPlatformTypeSchema>;
export const PostPlatformTypeEnum = PostPlatformTypeSchema.enum;
