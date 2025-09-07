import z from "zod";

export const PlatformTypeSchema = z.enum(["instagram", "twitter", "facebook"]);
export type PlatformType = z.infer<typeof PlatformTypeSchema>;
export const PlatformTypeEnum = PlatformTypeSchema.enum;

export const UserPlatformTypeSchema = z.enum(["instagram-user", "twitter-user", "facebook-user"]);
export type UserPlatformType = z.infer<typeof UserPlatformTypeSchema>;
export const UserPlatformTypeEnum = UserPlatformTypeSchema.enum;

export const PostPlatformTypeSchema = z.enum(["instagram-post", "twitter-post", "facebook-post"]);
export type PostPlatformType = z.infer<typeof PostPlatformTypeSchema>;
export const PostPlatformTypeEnum = PostPlatformTypeSchema.enum;
