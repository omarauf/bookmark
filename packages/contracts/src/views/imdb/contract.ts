import { z } from "zod";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
} from "../../foundation/pagination-query";
import { ImdbItemSchema } from "./entity";
import { ImdbFilterSchema } from "./filter";

export const ImdbSchemas = {
  list: {
    request: BasePaginationQuerySchema.extend({
      ...ImdbFilterSchema.shape,
    }),
    response: PaginationResultSchema(ImdbItemSchema),
  },

  genres: {
    response: z.array(z.string()),
  },

  get: {
    request: z.object({ id: z.uuid() }),
    response: ImdbItemSchema,
  },
};

export type ImdbItem = z.infer<typeof ImdbItemSchema>;
export type ListImdb = z.infer<typeof ImdbSchemas.list.request>;
