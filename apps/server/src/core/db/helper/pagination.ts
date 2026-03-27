// biome-ignore-all lint/suspicious/noExplicitAny: we want to allow any Drizzle query
import { and, asc, desc, is, SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

// This type represents any Drizzle query builder that can be executed
type ExecutableQuery = {
  execute: () => Promise<any>;
  then: (onfulfilled?: ((value: any) => any) | null) => Promise<any>;
};

type Props<TQuery extends ExecutableQuery> = {
  dataQuery: TQuery;
  countQuery: any;
  orderByColumn?: PgColumn | SQL | SQL.Aliased;
  orderDirection?: "asc" | "desc";
  filters?: SQL[] | SQL;
  page?: number;
  perPage?: number;
};

type PaginatedResult<TResult> = {
  items: TResult;
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export async function withPagination<TQuery extends ExecutableQuery, TResult = Awaited<TQuery>>({
  dataQuery,
  countQuery,
  orderByColumn,
  orderDirection = "asc",
  filters = [],
  page = 1,
  perPage = 10,
}: Props<TQuery>): Promise<PaginatedResult<TResult>> {
  const offset = (page - 1) * perPage;
  const currentPage = offset / perPage + 1;
  const whereCondition = Array.isArray(filters)
    ? filters.length > 0
      ? and(...filters)
      : undefined
    : filters;

  // Apply filters to data query
  let finalDataQuery = dataQuery as any;
  if (whereCondition) {
    finalDataQuery = finalDataQuery.where(whereCondition);
  }

  // Apply sorting
  if (orderByColumn) {
    finalDataQuery = finalDataQuery.orderBy(resolveOrderBy(orderByColumn, orderDirection));
  }

  finalDataQuery = finalDataQuery.limit(perPage).offset(offset);

  const [items, countResult] = await Promise.all([
    finalDataQuery,
    whereCondition ? (countQuery as any).where(whereCondition) : countQuery,
  ]);

  const totalCount = Number(countResult[0]?.count || 0);
  const totalPages = Math.ceil(totalCount / perPage);

  return {
    items: items as TResult,
    total: totalCount,
    page: currentPage,
    perPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}

function resolveOrderBy(
  orderBy: PgColumn | SQL | SQL.Aliased | undefined,
  direction: "asc" | "desc" = "asc",
) {
  if (!orderBy) return undefined;

  // If it's already SQL (asc/desc), return as-is
  if (is(orderBy, SQL)) {
    return orderBy;
  }

  // Otherwise, assume it's a column
  return direction === "asc" ? asc(orderBy) : desc(orderBy);
}

/**
 *
 * const dataQuery = db.select().from(persons).leftJoin(cars, eq(persons.id, cars.ownerId));
 * const countQuery = db
 *     .select({ count: count() })
 *     .from(persons)
 *     .leftJoin(cars, eq(persons.id, cars.ownerId));
 *
 * const filter = [lte(cars.price, 10000)];
 *
 * const data = await withPagination({
 *     dataQuery,
 *     countQuery,
 *     filters: filter,
 * });
 */
