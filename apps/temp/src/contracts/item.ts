import z from "zod";
import { KindEnum, PlatformEnum } from "./common";
import { CreateBaseItemSchema } from "./platform/base/item";
import { CreateInstagramCreatorSchema } from "./platform/instagram/creator";
import { CreateInstagramPostSchema } from "./platform/instagram/post";

export const CreateItemSchemaCommon = CreateBaseItemSchema.extend({
  // quotedPostId: z.uuid().optional(),
  // creatorId: z.string(),

  platform: PlatformEnum,
  kind: KindEnum,

  // user input
  // favorite: z.boolean().optional(),
  // tags: z.array(z.string()),
  // collectionId: z.uuid().optional(),
  // note: z.string().optional(),
  // rate: z.number().min(0).max(10).optional(),

  // dates
  // deletedAt: z.date().optional(),
  // createdAt: z.date(),
  // updatedAt: z.date(),
});

export const CreateItemSchema = z.discriminatedUnion("platform", [
  z.discriminatedUnion("kind", [
    CreateItemSchemaCommon.extend(CreateInstagramPostSchema.shape),
    CreateItemSchemaCommon.extend(CreateInstagramCreatorSchema.shape),
  ]),
]);

export type CreateItem = z.infer<typeof CreateItemSchema>;
