import { z } from "zod";
import { KindEnum, PlatformEnum } from "../../foundation/platform";
import { ItemMetadataSchema } from "./metadata";

export const CreateItemSchema = z.object({
  externalId: z.string(),
  url: z.url(),
  platform: PlatformEnum,
  kind: KindEnum,
  createdAt: z.date().optional(),
  caption: z.string().optional(),
  metadata: ItemMetadataSchema,
});

export const ItemSchema = CreateItemSchema.extend({
  id: z.uuid(),

  favorite: z.boolean().optional(),
  tagIds: z.uuid().array(),
  collectionIds: z.uuid().array(),
  note: z.string().optional(),
  rate: z.number().min(0).max(10).optional(),

  deletedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ItemBaseViewSchema = ItemSchema.omit({ metadata: true });
