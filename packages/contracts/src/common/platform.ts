import z from "zod";

export const PlatformEnum = z.enum(["instagram", "tiktok", "twitter"]);
export type Platform = z.infer<typeof PlatformEnum>;
export const PlatformValues = PlatformEnum.options as [Platform, ...Platform[]];

export const KindEnum = z.enum(["post", "profile"]);
export type Kind = z.infer<typeof KindEnum>;
export const KindValues = KindEnum.options as [Kind, ...Kind[]];
