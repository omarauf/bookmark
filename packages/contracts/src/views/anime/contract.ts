import { z } from "zod";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
} from "../../foundation/pagination-query";
import { AnimeItemSchema } from "./entity";
import { AnimeFilterSchema } from "./filter";

export const AnimeSchemas = {
  filter: AnimeFilterSchema,

  list: {
    request: BasePaginationQuerySchema.extend({
      ...AnimeFilterSchema.shape,
    }),
    response: PaginationResultSchema(AnimeItemSchema),
  },

  genres: {
    response: z.array(z.string()),
  },

  get: {
    request: z.object({ id: z.uuid() }),
    response: AnimeItemSchema,
  },

  sync: {
    request: z.object({}),
    response: z.object({}),
  },
};

export type AnimeItem = z.infer<typeof AnimeItemSchema>;
export type ListAnime = z.infer<typeof AnimeSchemas.list.request>;
