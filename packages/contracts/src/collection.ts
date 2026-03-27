import z from "zod";

const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters")
  .transform((v) => v.trim().toLowerCase().replace(/\s+/g, "-"));

const colorSchema = z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color");

const CollectionSchema = z.object({
  id: z.string(),
  name: nameSchema,
  color: colorSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CollectionSchemas = {
  list: {
    request: z.object({
      name: z.string().optional(),
    }),
    response: z.object({ ...CollectionSchema.shape, count: z.number() }).array(),
  },

  options: {
    request: z.void(),
    response: z.object({ id: z.uuid(), name: z.string(), color: colorSchema }).array(),
  },

  create: {
    request: CollectionSchema.pick({ name: true, color: true }),
    response: z.void(),
  },

  update: {
    request: CollectionSchema.pick({ id: true, name: true, color: true }),
    response: z.void(),
  },

  delete: {
    request: z.object({ id: z.string() }),
    response: z.void(),
  },
};

export type Collection = z.infer<typeof CollectionSchema>;
export type CollectionWithCount = Collection & { count: number };
export type CreateCollection = z.infer<typeof CollectionSchemas.create.request>;
export type UpdateCollection = z.infer<typeof CollectionSchemas.update.request>;
