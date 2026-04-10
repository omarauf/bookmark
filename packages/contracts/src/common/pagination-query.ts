import { z } from "zod";

export const PaginationParamsSchema = z.object({
  page: z.number().int().min(1).optional().default(1).catch(1),
  perPage: z.number().int().min(1).max(65).optional().default(40).catch(40),
});

export const SortingParamsSchema = z.object({
  sortBy: z.string().optional().catch(undefined),
  sortOrder: z.enum(["asc", "desc"]).optional().catch(undefined),
});

export const BasePaginationQuerySchema = PaginationParamsSchema.extend(SortingParamsSchema.shape);

export const PaginationResultSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    perPage: z.number().int().min(1),
    totalPages: z.number().int().min(0),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  });

export type PaginationResult<T> = {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
