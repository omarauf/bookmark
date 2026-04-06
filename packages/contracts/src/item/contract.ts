import z from "zod";
import { KindEnum, PlatformEnum } from "../common/platform";
import { CreateDownloadTaskSchema } from "../download-task";
import { CreateRelationSchema } from "../relation/entity";
import { CreateItemSchema, ItemSchema } from "./entity";
import { ItemFilterSchema } from "./filter";

export const ItemSchemas = {
  create: CreateItemSchema,
  filter: ItemFilterSchema,
  import: z.object({
    items: CreateItemSchema.array(),
    relations: CreateRelationSchema.array(),
    downloadTasks: CreateDownloadTaskSchema.array(),
  }),

  // list: {
  //   request: BasePaginationQuerySchema.extend({
  //     ...ItemFilterSchema.shape,
  //   }),
  //   response: PaginationResultSchema(RichItemSchema),
  // },

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
      collectionId: z.uuid().optional(),
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
export type ItemImport = z.infer<typeof ItemSchemas.import>;
// export type ListItem = z.infer<typeof ItemSchemas.list.request>;
export type UpdateItem = z.infer<typeof ItemSchemas.update.request>;
