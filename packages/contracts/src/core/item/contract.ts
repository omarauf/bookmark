import { z } from "zod";
import { KindEnum, PlatformEnum } from "../../foundation/platform";
import { CreateItemSchema, ItemSchema } from "./entity";
import { ItemFilterSchema } from "./filter";

export const ItemSchemas = {
  create: CreateItemSchema,
  filter: ItemFilterSchema,

  get: {
    request: z.object({ id: z.uuid() }),
    response: ItemSchema,
  },

  update: {
    request: z.object({
      id: z.uuid(),
      note: z.string().optional(),
      rate: z.number().optional(),
      tagIds: z.uuid().array(),
      collectionIds: z.uuid().array(),
      favorite: z.boolean().optional(),
    }),
    response: z.void(),
  },

  delete: {
    request: z.object({ id: z.string(), hard: z.boolean().default(false) }),
    response: z.void(),
  },

  deleteAll: {
    request: z.object({
      platform: PlatformEnum.optional(),
      kind: KindEnum.optional(),
      hard: z.boolean().default(false),
    }),
    response: z.void(),
  },
};

export type Item = z.infer<typeof ItemSchema>;
export type ItemMetadata = Item["metadata"];
export type CreateItem = z.infer<typeof CreateItemSchema>;
export type UpdateItem = z.infer<typeof ItemSchemas.update.request>;
