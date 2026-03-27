import z from "zod";
import { PlatformEnum } from "../../common/platform";

export const BasePostSchema = z.object({
  id: z.uuid(),
  quotedPostId: z.uuid().optional(),
  externalId: z.string(),
  creatorId: z.string(),
  platform: PlatformEnum,
  url: z.url(),
  favorite: z.boolean().optional(),
  tags: z.array(z.string()),
  collections: z.array(z.string()),
  note: z.string().optional(),
  rate: z.number().min(0).max(10).optional(),
  deletedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  caption: z.string().optional(),
});

export const CreateBasePostSchema = z.object({
  externalId: z.string(),
  externalCreatorId: z.string(),
  externalQuotedPostId: z.string().optional(),
  platform: PlatformEnum,
  url: z.url(),
  favorite: z.boolean().optional(),
  tags: z.array(z.string()),
  collections: z.array(z.string()),
  note: z.string().optional(),
  rate: z.number().min(0).max(10).optional(),
  caption: z.string().optional(),
  createdAt: z.date().optional(),
});
