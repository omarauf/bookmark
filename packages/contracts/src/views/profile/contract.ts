import { z } from "zod";
import {
  BasePaginationQuerySchema,
  PaginationResultSchema,
} from "../../foundation/pagination-query";
import { ProfileSchema } from "./entity";
import { ProfileFilterSchema } from "./filter";

export const ProfileSchemas = {
  filter: ProfileFilterSchema,

  list: {
    request: BasePaginationQuerySchema.extend({
      ...ProfileFilterSchema.shape,
      sortBy: z
        .enum(["createdAt", "username", "postCount", "tagCount"])
        .optional()
        .catch(undefined),
    }),
    response: PaginationResultSchema(ProfileSchema),
  },

  get: {
    request: z.object({ id: z.uuid() }),
    response: ProfileSchema,
  },
};

export type Profile = z.infer<typeof ProfileSchema>;
export type ListProfile = z.infer<typeof ProfileSchemas.list.request>;
