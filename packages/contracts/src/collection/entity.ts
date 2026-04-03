import z from "zod";
import { colorSchema } from "../common/color";

export const CollectionSchema = z.object({
  id: z.uuid(),
  label: z.string(),
  color: colorSchema,
  slug: z.string(),
  parentId: z.uuid().nullable(),
  path: z.string(),
  level: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
