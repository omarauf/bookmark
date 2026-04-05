import z from "zod";
import { KindEnum, PlatformEnum } from "../common/platform";
import { ItemMetadataSchema } from "./metadata";

// this has no id and optional createdAt
export const CreateItemSchema = z.object({
  externalId: z.string(),
  url: z.url(),
  platform: PlatformEnum,
  kind: KindEnum,
  createdAt: z.date().optional(),
  caption: z.string().optional(),
  metadata: ItemMetadataSchema,
});

// -----------------

export const ItemSchema = CreateItemSchema.extend({
  id: z.uuid(),

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

// import z from "zod";
// import { KindEnum, PlatformEnum } from "../common/platform";
// import { CreateInstagramCreatorSchema } from "../platform/instagram/creator";
// import { CreateInstagramPostSchema } from "../platform/instagram/post";
// import { CreateTiktokCreatorSchema } from "../platform/tiktok/creator";
// import { CreateTiktokPostSchema } from "../platform/tiktok/post";
// import { CreateTwitterCreatorSchema } from "../platform/twitter/creator";
// import { CreateTwitterPostSchema } from "../platform/twitter/post";

// // this has no id and optional createdAt
// const CreateBaseItemSchema = z.object({
//   externalId: z.string(),
//   url: z.url(),
//   platform: PlatformEnum,
//   kind: KindEnum,
//   createdAt: z.date().optional(),
//   caption: z.string().optional(),
// });

// export const CreateItemSchema = z.discriminatedUnion("platform", [
//   z.discriminatedUnion("kind", [
//     CreateBaseItemSchema.extend(CreateInstagramPostSchema.shape),
//     CreateBaseItemSchema.extend(CreateInstagramCreatorSchema.shape),
//   ]),

//   z.discriminatedUnion("kind", [
//     CreateBaseItemSchema.extend(CreateTiktokPostSchema.shape),
//     CreateBaseItemSchema.extend(CreateTiktokCreatorSchema.shape),
//   ]),

//   z.discriminatedUnion("kind", [
//     CreateBaseItemSchema.extend(CreateTwitterPostSchema.shape),
//     CreateBaseItemSchema.extend(CreateTwitterCreatorSchema.shape),
//   ]),
// ]);

// // -----------------

// const ItemSchemaCommon = CreateBaseItemSchema.extend({
//   // user input
//   favorite: z.boolean().optional(),
//   tags: z.array(z.string()),
//   collectionId: z.uuid().optional(),
//   note: z.string().optional(),
//   rate: z.number().min(0).max(10).optional(),

//   // dates
//   deletedAt: z.date().optional(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
// });

// export const ItemSchema = z.discriminatedUnion("platform", [
//   z.discriminatedUnion("kind", [
//     ItemSchemaCommon.extend(CreateInstagramPostSchema.shape),
//     ItemSchemaCommon.extend(CreateInstagramCreatorSchema.shape),
//   ]),

//   z.discriminatedUnion("kind", [
//     ItemSchemaCommon.extend(CreateTiktokPostSchema.shape),
//     ItemSchemaCommon.extend(CreateTiktokCreatorSchema.shape),
//   ]),

//   z.discriminatedUnion("kind", [
//     ItemSchemaCommon.extend(CreateTwitterPostSchema.shape),
//     ItemSchemaCommon.extend(CreateTwitterCreatorSchema.shape),
//   ]),
// ]);
