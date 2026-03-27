import z from "zod";
import { PlatformEnum } from "../../common/platform";

export const BaseCreatorSchema = z.object({
  id: z.uuid(),
  externalId: z.string(),
  url: z.url(),
  username: z.string(),
  platform: PlatformEnum,
  avatar: z.string(),
  verified: z.boolean().optional(),
  name: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateBaseCreatorSchema = z.object({
  externalId: z.string(),
  url: z.url(),
  username: z.string(),
  platform: PlatformEnum,
  avatar: z.string().optional(),
  name: z.string().optional(),
  createdAt: z.date().optional(),
  verified: z.boolean().optional(),
});
