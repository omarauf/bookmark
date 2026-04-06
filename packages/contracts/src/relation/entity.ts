import { z } from "zod";
import { RelationEnum } from "./enum";

// [Instagram Post] --created_by--> [Instagram Profile]
// [Post] --mentions--> [Movie]
// [Post A] --related--> [Post B]

export const RelationSchema = z.object({
  fromItemId: z.uuid(),
  toItemId: z.uuid(),

  relationType: RelationEnum,

  createdAt: z.date(),

  x: z.number().optional(),
  y: z.number().optional(),
});

export const CreateRelationSchema = z.object({
  fromExternalId: z.string(),
  toExternalId: z.string(),

  relationType: RelationEnum,
  createdAt: z.date().optional(),

  x: z.number().optional(),
  y: z.number().optional(),
});

export type Relation = z.infer<typeof RelationSchema>;
export type CreateRelation = z.infer<typeof CreateRelationSchema>;
