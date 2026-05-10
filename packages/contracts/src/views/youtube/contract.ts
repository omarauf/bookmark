import { z } from "zod";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
} from "../../foundation/pagination-query";
import { YoutubeSchema } from "./entity";
import { YoutubeFilterSchema } from "./filter";

export const YoutubeSchemas = {
  list: {
    request: BasePaginationQuerySchema.extend({
      ...YoutubeFilterSchema.shape,
    }),
    response: PaginationResultSchema(YoutubeSchema),
  },

  genres: {
    response: z.array(z.string()),
  },

  get: {
    request: z.object({ id: z.uuid() }),
    response: YoutubeSchema,
  },

  sync: {
    request: z.object({}),
    response: z.object({}),
  },
};

export type Youtube = z.infer<typeof YoutubeSchema>;
export type ListYoutube = z.infer<typeof YoutubeSchemas.list.request>;
