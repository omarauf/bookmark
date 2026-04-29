import { z } from "zod";
import { ColorSchema } from "../../foundation/color";

export const CollectionSchema = z.object({
  id: z.uuid(),
  label: z.string(),
  color: ColorSchema,
  slug: z.string(),
  parentId: z.uuid().nullable(),
  path: z.string(),
  level: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CollectionSummarySchema = CollectionSchema.pick({
  id: true,
  label: true,
  color: true,
  slug: true,
  path: true,
});
