import { z } from "zod";
import { dateOnly } from "../../foundation/date";
import { PlatformEnum } from "../../foundation/platform";
import { InstagramPostTypeEnum } from "../../platforms/instagram/enum";

export const ItemFilterSchema = z.object({
  platform: PlatformEnum.optional().catch(undefined),
  username: z.string().optional().catch(undefined),
  collectionIds: z
    .array(z.string())
    .optional()
    .catch(undefined)
    .transform((val) => (val?.length === 0 ? undefined : val)),
  type: InstagramPostTypeEnum.optional().catch(undefined),
  from: dateOnly().optional().catch(undefined),
  to: dateOnly().optional().catch(undefined),
  sortBy: z.enum(["createdAt", "rate"]).optional().catch(undefined),
});

export type ItemFilter = z.infer<typeof ItemFilterSchema>;

export const itemFilterKeys = Object.keys(ItemFilterSchema.shape);
