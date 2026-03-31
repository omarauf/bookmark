import z from "zod";
import { PlatformEnum } from "../common/platform";

export const PostFilterSchema = z.object({
  platform: PlatformEnum.optional().catch(undefined),
  username: z.string().optional().catch(undefined),
});

export type PostFilter = z.infer<typeof PostFilterSchema>;

export const postFilterKeys = Object.keys(PostFilterSchema.shape);
