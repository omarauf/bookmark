import z from "zod";
import { dataTableConfig } from "./config";

export const SortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

export const BasicSearchSchema = z.object({
  page: z.number().optional().catch(undefined),
  perPage: z.number().optional().catch(undefined),
  sorting: z.array(SortingItemSchema).optional(),
});

export const SearchSchema = z
  .object({
    page: z.number().optional().catch(undefined),
    perPage: z.number().optional().catch(undefined),
    sorting: z.array(SortingItemSchema).optional().catch(undefined),
  })
  .catchall(
    z
      .union([
        z.string(),
        z.array(z.string()),
        z.array(z.number()),
        z.array(SortingItemSchema),
        z.number(),
        z.boolean(),
        z.undefined(),
      ])
      .optional(),
  );

const FilterItemSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  variant: z.enum(dataTableConfig.filterVariants),
  operator: z.enum(dataTableConfig.operators),
  filterId: z.string(),
});

export const AdvancedSearchSchema = z.object({
  page: z.number().optional().catch(undefined),
  perPage: z.number().optional().catch(undefined),
  sorting: z.array(SortingItemSchema).optional().catch(undefined),
  filters: z.array(FilterItemSchema).optional().catch(undefined),
  joinOperator: z.enum(dataTableConfig.joinOperators).optional().catch(undefined),
});

export type SearchParams = z.infer<typeof SearchSchema>;
export type FilterItemSchema = z.infer<typeof FilterItemSchema>;
export type AdvancedSearchParams = z.infer<typeof AdvancedSearchSchema>;
