import { z } from "zod";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
} from "../../foundation/pagination-query";
import { YoutubeItemSchema } from "./entity";
import { YoutubeFilterSchema } from "./filter";

export const YoutubeSchemas = {
  list: {
    request: BasePaginationQuerySchema.extend({
      ...YoutubeFilterSchema.shape,
    }),
    response: PaginationResultSchema(YoutubeItemSchema),
  },

  genres: {
    response: z.array(z.string()),
  },

  get: {
    request: z.object({ id: z.uuid() }),
    response: YoutubeItemSchema,
  },

  sync: {
    request: z.object({}),
    response: z.object({}),
  },
};

export type YoutubeItem = z.infer<typeof YoutubeItemSchema>;
export type ListYoutube = z.infer<typeof YoutubeSchemas.list.request>;
