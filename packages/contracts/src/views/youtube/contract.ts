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

  listFormats: {
    request: z.object({ id: z.uuid() }),
    response: z.object({
      formats: z
        .object({
          formatId: z.string(),
          ext: z.string(),
          resolution: z.string(),
          filesize: z.number().optional(),
          vcodec: z.string(),
          acodec: z.string(),
          fps: z.number().optional(),
          qualityLabel: z.string().optional(),
          hasVideo: z.boolean(),
          hasAudio: z.boolean(),
        })
        .array(),
    }),
  },

  download: {
    request: z.object({ id: z.uuid(), formatId: z.string() }),
    response: z.object({ jobId: z.string() }),
  },
};

export type Youtube = z.infer<typeof YoutubeSchema>;
export type ListYoutube = z.infer<typeof YoutubeSchemas.list.request>;
