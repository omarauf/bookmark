import z from "zod";
import { KindEnum, PlatformEnum } from "./common";
import { CreateDownloadTaskSchema } from "./download-task";
import { CreateItemRelationSchema } from "./item-relation";
import { CreateInstagramCreatorSchema } from "./platform/instagram/creator";
import { CreateInstagramPostSchema } from "./platform/instagram/post";

// this has no id and optional createdAt
export const CreateBaseItemSchema = z.object({
  externalId: z.string(),
  url: z.url(),
  platform: PlatformEnum,
  kind: KindEnum,
  createdAt: z.date().optional(),
  caption: z.string().optional(),
});

export const CreateItemSchema = z.discriminatedUnion("platform", [
  z.discriminatedUnion("kind", [
    CreateBaseItemSchema.extend(CreateInstagramPostSchema.shape),
    CreateBaseItemSchema.extend(CreateInstagramCreatorSchema.shape),
  ]),
]);

// -----------------

export const ItemSchemaCommon = CreateBaseItemSchema.extend({
  // user input
  favorite: z.boolean().optional(),
  tags: z.array(z.string()),
  collectionId: z.uuid().optional(),
  note: z.string().optional(),
  rate: z.number().min(0).max(10).optional(),

  // dates
  deletedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ItemSchema = z.discriminatedUnion("platform", [
  z.discriminatedUnion("kind", [
    ItemSchemaCommon.extend(CreateInstagramPostSchema.shape),
    ItemSchemaCommon.extend(CreateInstagramCreatorSchema.shape),
  ]),
]);

// -----------------

export const ImportItemSchema = z.object({
  items: CreateItemSchema.array(),
  relations: CreateItemRelationSchema.array(),
  downloadJob: CreateDownloadTaskSchema.array(),
});

export type CreateItem = z.infer<typeof CreateItemSchema>;
export type ImportItem = z.infer<typeof ImportItemSchema>;
export type ItemMetadata = CreateItem["metadata"];
