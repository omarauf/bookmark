import type { OnChangeFn, RowData, Table, TableFeature, Updater } from "@tanstack/react-table";
import { functionalUpdate, makeStateUpdater } from "@tanstack/react-table";
import type { ExtendedColumnFilter } from "../types/data-table";

// define types for our new feature's custom state
export type AdvancedFilterState<TData extends RowData> = {
  filters: ExtendedColumnFilter<TData>[];
  joinOperator: "and" | "or";
};

export type FilterTableState = {
  // biome-ignore lint/suspicious/noExplicitAny: this is a generated file
  advancedFilters: AdvancedFilterState<any>;
};

// define types for our new feature's table options
export type FilterOptions<TData extends RowData> = {
  enableAdvancedFilter?: boolean;
  onAdvancedFiltersChange?: OnChangeFn<AdvancedFilterState<TData>>;
};

// Define types for our new feature's table APIs
export type FilterInstance<TData extends RowData> = {
  setAdvancedFilters: (
    updater: ExtendedColumnFilter<TData>[] | Updater<ExtendedColumnFilter<TData>[]>,
  ) => void;
  setJoinOperator: (operator: "and" | "or" | Updater<"and" | "or">) => void;
};

export const AdvancedFilterFeature: TableFeature = {
  // Use the TableFeature type!!
  // define the new feature's initial state
  getInitialState: (state): FilterTableState => ({
    advancedFilters: {
      filters: [],
      joinOperator: "and",
    },
    ...state,
  }),

  // define the new feature's default options
  getDefaultOptions: <TData extends RowData>(table: Table<TData>): FilterOptions<TData> =>
    ({
      enableAdvancedFilter: false,
      onAdvancedFiltersChange: makeStateUpdater("advancedFilters", table),
    }) as FilterOptions<TData>,

  // define the new feature's table instance methods
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setAdvancedFilters = (updater) => {
      const safeUpdater: Updater<AdvancedFilterState<TData>> = (old) => {
        const newFilters =
          typeof updater === "function" ? functionalUpdate(updater, old.filters) : updater;
        return { ...old, filters: newFilters };
      };

      return table.options.onAdvancedFiltersChange?.(safeUpdater);
    };
    table.setJoinOperator = (updater) => {
      const safeUpdater: Updater<AdvancedFilterState<TData>> = (old) => {
        const newOperator =
          typeof updater === "function" ? functionalUpdate(updater, old.joinOperator) : updater;
        return { ...old, joinOperator: newOperator };
      };

      return table.options.onAdvancedFiltersChange?.(safeUpdater);
    };
  },

  // if you need to add row instance APIs...
  // createRow: <TData extends RowData>(row, table): void => {},
  // if you need to add cell instance APIs...
  // createCell: <TData extends RowData>(cell, column, row, table): void => {},
  // if you need to add column instance APIs...
  // createColumn: <TData extends RowData>(column, table): void => {},
  // if you need to add header instance APIs...
  // createHeader: <TData extends RowData>(header, table): void => {},
};
