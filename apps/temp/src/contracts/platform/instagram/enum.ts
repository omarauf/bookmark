import z from "zod";

export const InstagramPostTypeEnum = z.enum(["Photo", "Video", "IGTV", "Reel", "Carousel"]);
export type InstagramPostType = z.infer<typeof InstagramPostTypeEnum>;
export const InstagramPostTypeValues = InstagramPostTypeEnum.options as [
  InstagramPostType,
  ...InstagramPostType[],
];
