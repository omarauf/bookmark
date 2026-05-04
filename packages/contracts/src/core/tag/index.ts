import { z } from "zod";
import { ColorSchema } from "../../foundation/color";

const NameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters")
  .transform((v) => v.trim().toLowerCase().replace(/\s+/g, "-"));

export const TagSchema = z.object({
  id: z.string(),
  name: NameSchema,
  color: ColorSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TagSchemas = {
  list: {
    response: z.object({ ...TagSchema.shape, count: z.number() }).array(),
  },

  options: {
    request: z.void(),
    response: z.object({ value: z.uuid(), label: z.string(), color: ColorSchema }).array(),
  },

  create: {
    request: TagSchema.pick({ name: true, color: true }),
    response: z.void(),
  },

  update: {
    request: TagSchema.pick({ id: true, name: true, color: true }),
    response: z.void(),
  },

  delete: {
    request: z.object({ id: z.string() }),
    response: z.void(),
  },
};

export type Tag = z.infer<typeof TagSchema>;
export type CreateTag = z.infer<typeof TagSchemas.create.request>;
export type UpdateTag = z.infer<typeof TagSchemas.update.request>;
