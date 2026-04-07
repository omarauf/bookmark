import z from "zod";
import { dateOnly } from "../common/date";
import { PlatformEnum } from "../common/platform";
import { InstagramPostTypeEnum } from "../platform/instagram/enum";

export const PostFilterSchema = z.object({
  platform: PlatformEnum.optional().catch(undefined),
  username: z.string().optional().catch(undefined),
  collectionPath: z.string().optional().catch(undefined),
  collectionIds: z
    .array(z.string())
    .transform((val) => (val && val.length > 0 ? val : undefined))
    .optional()
    .catch(undefined),
  collectionPaths: z
    .array(z.string())
    .transform((val) => (val && val.length > 0 ? val : undefined))
    .optional()
    .catch(undefined),
  type: InstagramPostTypeEnum.optional().catch(undefined),
  from: dateOnly().optional().catch(undefined),
  to: dateOnly().optional().catch(undefined),
  sortBy: z.enum(["createdAt", "rate"]).optional().catch(undefined),
});

export type PostFilter = z.infer<typeof PostFilterSchema>;

export const postFilterKeys = Object.keys(PostFilterSchema.shape);
