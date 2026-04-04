import z from "zod";
import { KindEnum, PlatformEnum } from "../../common";

// this has no id and optional createdAt
export const CreateBaseItemSchema = z.object({
  externalId: z.string(),
  url: z.url(),
  platform: PlatformEnum,
  kind: KindEnum,
  createdAt: z.date().optional(),
  caption: z.string().optional(),
});
