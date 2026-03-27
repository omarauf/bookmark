import z from "zod";
import { BasePaginationQuerySchema, PaginationResultSchema } from "../common/pagination-query";
import type { CreateBaseCreatorSchema } from "../platform/base/creator";
import { CreateCreatorSchema, type CreatorSchema } from "./entity";

export const CreatorSchemas = {
  create: CreateCreatorSchema,

  list: {
    request: BasePaginationQuerySchema,
    response: PaginationResultSchema(CreateCreatorSchema),
  },

  delete: {
    request: z.object({ id: z.string() }),
    response: z.void(),
  },

  deleteAll: {
    response: z.void(),
  },
};

export type Creator = z.infer<typeof CreatorSchema>;
export type CreatorMetadata = Creator["metadata"];

export type CreateCreator = z.infer<typeof CreateCreatorSchema>;
export type CreateBaseCreator = z.infer<typeof CreateBaseCreatorSchema>;
