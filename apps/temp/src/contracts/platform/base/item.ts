import z from "zod";
import { KindEnum, PlatformEnum } from "../../common";

export const BaseItemSchema = z.object({
  id: z.uuid(),
  externalId: z.string(),
  url: z.url(),
  platform: PlatformEnum,
  kind: KindEnum,
  createdAt: z.date(),
  caption: z.string().optional(), // this could be a bio, description, caption etc depending on the item type
  //   updatedAt: z.date(),
});

// this has no id and optional createdAt
export const CreateBaseItemSchema = z.object({
  externalId: z.string(),
  url: z.url(),
  platform: PlatformEnum,
  kind: KindEnum,
  createdAt: z.date().optional(),
  caption: z.string().optional(),
});
