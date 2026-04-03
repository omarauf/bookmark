import z from "zod";
import { colorSchema as ColorSchema } from "../common/color";
import { CollectionSchema } from "./entity";

export const CollectionSchemas = {
  all: {
    response: CollectionSchema.array(),
  },

  list: {
    request: z.object({
      path: z.string().optional(),
      depth: z.number().int().positive().optional(),
      extraPath: z.string().optional(),
    }),
    response: z
      .object({
        id: z.uuid(),
        parentId: z.uuid().nullable(),
        color: ColorSchema,
        level: z.number(),
        slug: z.string(),
        label: z.string(),
        isLast: z.boolean(),
        value: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
      .array(),
  },

  breadcrumb: {
    request: z.union([z.object({ id: z.uuid() }), z.object({ path: z.string() })]),
    response: z.object({ label: z.string(), path: z.string() }).array(),
  },

  get: {
    request: z.object({ id: z.uuid() }),
    response: CollectionSchema,
  },

  create: {
    request: CollectionSchema.omit({
      id: true,
      path: true,
      level: true,
      createdAt: true,
      updatedAt: true,
    }),
    response: z.void(),
  },

  update: {
    request: CollectionSchema.omit({ path: true, level: true, createdAt: true, updatedAt: true }),
    response: z.void(),
  },

  delete: {
    request: z.object({ id: z.uuid() }),
    response: z.void(),
  },
};

export type Collection = z.infer<typeof CollectionSchema>;
export type CollectionWithCount = Collection & { count: number };
export type CreateCollection = z.infer<typeof CollectionSchemas.create.request>;
export type UpdateCollection = z.infer<typeof CollectionSchemas.update.request>;

export type CollectionTree = Collection & {
  children: CollectionTree[];
};
