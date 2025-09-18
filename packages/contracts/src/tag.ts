import z from "zod";
import { SortingParamsSchema } from "./common/pagination-query";

const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters")
  .transform((v) => v.trim().toLowerCase().replace(/\s+/g, "-"));

const colorSchema = z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color");

export const TagSchema = z.object({
  _id: z.string(),
  id: z.string(),
  name: nameSchema,
  color: colorSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TagWithCountSchema = TagSchema.extend({
  count: z.number().min(0),
});

export const ListTagSchema = SortingParamsSchema.extend({
  name: nameSchema.optional(),
  sortBy: z.enum(["name", "count"]).optional(),
});

export const CreateTagSchema = TagSchema.pick({ name: true, color: true }).partial({
  color: true,
});

export const UpdateTagSchema = TagSchema.pick({
  id: true,
  name: true,
  color: true,
});

export const DeleteTagSchema = TagSchema.pick({ id: true });

export type Tag = z.infer<typeof TagSchema>;
export type CreateTag = z.infer<typeof CreateTagSchema>;
export type UpdateTag = z.infer<typeof UpdateTagSchema>;
export type ListTags = z.infer<typeof ListTagSchema>;
export type DeleteTag = z.infer<typeof DeleteTagSchema>;
export type TagWithCount = z.infer<typeof TagWithCountSchema>;
