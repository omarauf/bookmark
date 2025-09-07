/** biome-ignore-all lint/correctness/noUnusedVariables: this by the tanstack-table */
import type { ColumnSort, Row, RowData } from "@tanstack/react-table";
import type { DataTableConfig } from "@workspace/contracts/table";
import type {
  FilterInstance as AdvancedFilterInstance,
  FilterOptions as AdvancedFilterOptions,
  FilterTableState as AdvancedFilterTableState,
} from "@workspace/ui/lib/advanced-filter";
import type { FilterItemSchema } from "@workspace/ui/lib/parsers";

type FeatureTableState = AdvancedFilterTableState;
type FeatureTableOptions<TData extends RowData> = AdvancedFilterOptions<TData>;
type FeatureTableInstance<TData extends RowData> = AdvancedFilterInstance<TData>;

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    placeholder?: string;
    variant?: FilterVariant;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    filterVariant?: "text" | "range" | "select";
    className?: string;
  }

  interface ColumnDefBase<TData extends RowData, TValue = unknown> {
    className?: string;
  }

  // merge our new feature's state with the existing table state
  interface TableState extends FeatureTableState {}
  // merge our new feature's options with the existing table options
  interface TableOptionsResolved<TData extends RowData> extends FeatureTableOptions<TData> {}
  // merge our new feature's instance APIs with the existing table instance APIs
  interface Table<TData extends RowData> extends FeatureTableInstance<TData> {}
}

export interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type FilterOperator = DataTableConfig["operators"][number];
export type FilterVariant = DataTableConfig["filterVariants"][number];
export type JoinOperator = DataTableConfig["joinOperators"][number];

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
  id: Extract<keyof TData, string>;
}

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  variant: "update" | "delete";
}

export type ColumnFilter = Record<
  string,
  string | string[] | number | number[] | boolean | undefined
>;
