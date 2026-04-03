import z from "zod";

export const PlatformEnum = z.enum(["instagram", "tiktok", "twitter"]);
export type Platform = z.infer<typeof PlatformEnum>;
export const PlatformValues = PlatformEnum.options as [Platform, ...Platform[]];
