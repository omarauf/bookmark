import z from "zod";
import { SortingParamsSchema } from "./common/pagination-query";

const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters")
  .transform((v) => v.trim().toLowerCase().replace(/\s+/g, "-"));

const colorSchema = z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color");

export const CollectionSchema = z.object({
  id: z.string(),
  name: nameSchema,
  color: colorSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CollectionWithCountSchema = CollectionSchema.extend({
  count: z.number().min(0),
});

export const ListCollectionSchema = SortingParamsSchema.extend({
  name: nameSchema.optional(),
  sortBy: z.enum(["name", "count"]).optional(),
});

export const CreateCollectionSchema = CollectionSchema.pick({ name: true, color: true });

export const UpdateCollectionSchema = CollectionSchema.pick({
  id: true,
  name: true,
  color: true,
});

export const DeleteCollectionSchema = CollectionSchema.pick({ id: true });

export type Collection = z.infer<typeof CollectionSchema>;
export type CreateCollection = z.infer<typeof CreateCollectionSchema>;
export type UpdateCollection = z.infer<typeof UpdateCollectionSchema>;
export type ListCollections = z.infer<typeof ListCollectionSchema>;
export type DeleteCollection = z.infer<typeof DeleteCollectionSchema>;
export type CollectionWithCount = z.infer<typeof CollectionWithCountSchema>;
