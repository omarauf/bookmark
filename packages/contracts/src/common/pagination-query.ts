import { z } from "zod";

export const PaginationParamsSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(200).optional(),
});

export const SortingParamsSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const BasePaginationQuerySchema = PaginationParamsSchema.extend(SortingParamsSchema.shape);
