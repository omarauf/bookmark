import { z } from "zod";
import { PlatformEnum } from "../../foundation/platform";

export const ProfileFilterSchema = z.object({
  platform: PlatformEnum.optional().catch(undefined),
  username: z.string().optional().catch(undefined),
});

export type ProfileFilter = z.infer<typeof ProfileFilterSchema>;
