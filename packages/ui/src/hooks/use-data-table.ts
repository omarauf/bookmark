import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import type { AdvancedSearchParams, SearchParams } from "@workspace/contracts/table";
import { useDebouncedCallback } from "@workspace/ui/hooks/use-debounced-callback";
import { AdvancedFilterFeature, type AdvancedFilterState } from "@workspace/ui/lib/advanced-filter";
import { arrayEqual } from "@workspace/ui/lib/equity";
import type {
  ColumnFilter,
  ExtendedColumnFilter,
  ExtendedColumnSort,
} from "@workspace/ui/types/data-table";
import * as React from "react";

const PAGE_KEY = "page";
const PER_PAGE_KEY = "perPage";
const SORT_KEY = "sorting";
const FILTERS_KEY = "filters";
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;

interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | "state"
      | "pageCount"
      | "getCoreRowModel"
      | "manualFiltering"
      | "manualPagination"
      | "manualSorting"
    >,
    Required<Pick<TableOptions<TData>, "pageCount">> {
  initialState?: Omit<Partial<TableState>, "sorting"> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
  debounceMs?: number;
  throttleMs?: number;
  clearOnDefault?: boolean;
  enableAdvancedFilter?: boolean;
  scroll?: boolean;
  search: SearchParams | AdvancedSearchParams;
  navigate: (props: Updater<SearchParams | AdvancedSearchParams>) => void;
}

// Priority to search -> initialState -> default values
export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount = -1,
    initialState,
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    enableAdvancedFilter = false,
    search,
    navigate,
    ...tableProps
  } = props;

  const defaultPerPage = initialState?.pagination?.pageSize || 10;
  const defaultPage = (initialState?.pagination?.pageIndex || 0) + 1 || 1;
  const defaultSorting = React.useMemo(() => initialState?.sorting || [], [initialState?.sorting]);
  const defaultJoinOperator = (initialState?.advancedFilters?.joinOperator || "and") as
    | "and"
    | "or";

  const {
    page = defaultPage,
    perPage = defaultPerPage,
    sorting = defaultSorting,
    joinOperator = defaultJoinOperator,
    ...columnFilter
  } = search;

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    initialState?.columnVisibility ?? {},
  );

  /* ---------------------------------------------- Pagination ---------------------------------------------- */

  const setPage = React.useCallback(
    (newPage: number) => {
      navigate((prev) => ({ ...prev, [PAGE_KEY]: newPage !== defaultPage ? newPage : undefined }));
    },
    [navigate, defaultPage],
  );

  const setPerPage = React.useCallback(
    (newPage: number) => {
      navigate((prev) => ({
        ...prev,
        [PER_PAGE_KEY]: newPage !== defaultPerPage ? newPage : undefined,
      }));
    },
    [navigate, defaultPerPage],
  );

  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1, // zero-based index -> one-based index
      pageSize: perPage,
    };
  }, [page, perPage]);

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === "function") {
        const newPagination = updaterOrValue(pagination);
        void setPage(newPagination.pageIndex + 1);
        void setPerPage(newPagination.pageSize);
      } else {
        void setPage(updaterOrValue.pageIndex + 1);
        void setPerPage(updaterOrValue.pageSize);
      }
    },
    [pagination, setPage, setPerPage],
  );

  /* ------------------------------------------------ Sorting ----------------------------------------------- */
  const setSorting = React.useCallback(
    (newSorting: ExtendedColumnSort<TData>[]) => {
      navigate((prev) => ({
        ...prev,
        [SORT_KEY]: arrayEqual(newSorting, defaultSorting, ["desc", "id"]) ? undefined : newSorting,
      }));
    },
    [navigate, defaultSorting],
  );

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === "function") {
        const newSorting = updaterOrValue(sorting);
        setSorting(newSorting as ExtendedColumnSort<TData>[]);
      } else {
        setSorting(updaterOrValue as ExtendedColumnSort<TData>[]);
      }
    },
    [sorting, setSorting],
  );

  /* --------------------------------------------- Column Filter -------------------------------------------- */

  /**
   * Here there are two states for column filters:
   * 1. `initialColumnFilters`: This is the state derived from the search params then initial state.
   * 2. `columnFilters`: This is the state that is used to hold the column filter.
   * we have two states because we to support debouncing  the 2nd state update immediately while the
   * search state is updated with a debounce.
   * also, we are mapping between two states. ColumnFiltersState and ColumnFilter
   */

  const filterableColumns = React.useMemo(() => {
    if (enableAdvancedFilter) return [];

    return columns.filter((column) => column.enableColumnFilter);
  }, [columns, enableAdvancedFilter]);

  const setFilterSearch = React.useCallback(
    (newFilters: ColumnFilter) => {
      navigate((prev) => ({ ...prev, ...newFilters }));
    },
    [navigate],
  );

  const debouncedSetFilterSearch = useDebouncedCallback((values: ColumnFilter) => {
    void setPage(1);
    void setFilterSearch(values);
  }, debounceMs);

  // biome-ignore lint/correctness/useExhaustiveDependencies: the column filter is being serialized
  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    if (enableAdvancedFilter) return [];

    const initialFilter = initialState?.columnFilters?.reduce(
      (acc, filter) => {
        acc[filter.id] = filter.value;
        return acc;
      },
      {} as Record<string, unknown>,
    );

    const filterValues = { ...initialFilter, ...columnFilter };

    return Object.entries(filterValues).reduce<ColumnFiltersState>((filters, [key, value]) => {
      if (value !== null) {
        const processedValue = Array.isArray(value)
          ? value
          : typeof value === "string" && /[^a-zA-Z0-9]/.test(value)
            ? value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
            : [value];

        filters.push({
          id: key,
          value: processedValue,
        });
      }
      return filters;
    }, []);
    // Use JSON.stringify(columnFilter) to avoid dependency on a changing object reference
  }, [enableAdvancedFilter, initialState?.columnFilters, JSON.stringify(columnFilter)]);

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      if (enableAdvancedFilter) return;

      setColumnFilters((prev) => {
        const next = typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue;

        const filterUpdates = next.reduce<ColumnFilter>((acc, filter) => {
          if (filterableColumns.find((column) => column.id === filter.id)) {
            acc[filter.id] = filter.value as string | string[];
          }
          return acc;
        }, {});

        for (const prevFilter of prev) {
          if (!next.some((filter) => filter.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = undefined;
          }
        }

        debouncedSetFilterSearch(filterUpdates);
        return next;
      });
    },
    [debouncedSetFilterSearch, filterableColumns, enableAdvancedFilter],
  );

  /* -------------------------------------------- Advanced Filter ------------------------------------------- */

  const initialAdvancedFilters = React.useMemo<AdvancedFilterState<TData>>(
    () => ({
      filters:
        (search.filters as ExtendedColumnFilter<TData>[]) || initialState?.advancedFilters || [],
      joinOperator: (joinOperator as "and" | "or") || "and",
    }),
    [initialState?.advancedFilters, joinOperator, search.filters],
  );

  const [advancedFilters, setAdvancedFilters] =
    React.useState<AdvancedFilterState<TData>>(initialAdvancedFilters);

  const setAdvancedFilterSearch = React.useCallback(
    (newFilters: AdvancedFilterState<TData>) => {
      navigate((prev) => ({
        ...prev,
        [FILTERS_KEY]: newFilters.filters.length === 0 ? undefined : newFilters.filters,
        joinOperator:
          newFilters.joinOperator !== defaultJoinOperator ? newFilters.joinOperator : undefined,
      }));
    },
    [defaultJoinOperator, navigate],
  );

  const debouncedSetAdvancedFilterSearch = useDebouncedCallback(
    (values: AdvancedFilterState<TData>) => {
      void setPage(1);
      void setAdvancedFilterSearch(values);
    },
    debounceMs,
  );

  const onAdvancedFiltersChange = React.useCallback(
    (updaterOrValue: Updater<AdvancedFilterState<TData>>) => {
      if (!enableAdvancedFilter) return;

      setAdvancedFilters((prev) => {
        const next = typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue;

        debouncedSetAdvancedFilterSearch(next);
        return next;
      });
    },
    [debouncedSetAdvancedFilterSearch, enableAdvancedFilter],
  );

  const table = useReactTable({
    ...tableProps,
    columns,
    _features: [AdvancedFilterFeature],
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      advancedFilters,
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    enableAdvancedFilter,
    onRowSelectionChange: setRowSelection,
    onAdvancedFiltersChange: onAdvancedFiltersChange,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return { table, debounceMs, throttleMs };
}
