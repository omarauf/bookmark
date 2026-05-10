import { z } from "zod";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
} from "../../foundation/pagination-query";
import { AnimeSchema } from "./entity";
import { AnimeFilterSchema } from "./filter";

export const AnimeSchemas = {
  filter: AnimeFilterSchema,

  list: {
    request: BasePaginationQuerySchema.extend({
      ...AnimeFilterSchema.shape,
    }),
    response: PaginationResultSchema(AnimeSchema),
  },

  genres: {
    response: z.array(z.string()),
  },

  get: {
    request: z.object({ id: z.uuid() }),
    response: AnimeSchema,
  },

  sync: {
    request: z.object({}),
    response: z.object({}),
  },
};

export type Anime = z.infer<typeof AnimeSchema>;
export type ListAnime = z.infer<typeof AnimeSchemas.list.request>;
