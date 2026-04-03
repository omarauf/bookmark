import { z } from "zod";
import { RelationEnum } from "./common";

// [Instagram Post] --created_by--> [Instagram Profile]
// [Post] --mentions--> [Movie]
// [Post A] --related--> [Post B]

export const ItemRelationSchema = z.object({
  id: z.uuid(),

  fromItemId: z.uuid(),
  toItemId: z.uuid(),

  relationType: RelationEnum,

  createdAt: z.date(),

  x: z.number().optional(),
  y: z.number().optional(),
});

export const CreateItemRelationSchema = z.object({
  fromExternalId: z.string(),
  toExternalId: z.string(),

  relationType: RelationEnum,
  createdAt: z.date().optional(),

  x: z.number().optional(),
  y: z.number().optional(),
});

export type ItemRelation = z.infer<typeof ItemRelationSchema>;
export type CreateItemRelation = z.infer<typeof CreateItemRelationSchema>;
