import { z } from "zod";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
} from "../../foundation/pagination-query";
import { ImdbSchema } from "./entity";
import { ImdbFilterSchema } from "./filter";

export const ImdbSchemas = {
  filter: ImdbFilterSchema,

  list: {
    request: BasePaginationQuerySchema.extend({
      ...ImdbFilterSchema.shape,
    }),
    response: PaginationResultSchema(ImdbSchema),
  },

  genres: {
    response: z.array(z.string()),
  },

  get: {
    request: z.object({ id: z.uuid() }),
    response: ImdbSchema,
  },
};

export type ImdbItem = z.infer<typeof ImdbSchema>;
export type ListImdb = z.infer<typeof ImdbSchemas.list.request>;
