import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ScrapeRow } from "./parse";
import { ScrapeRowSheet } from "./row-sheet";

const columns: ColumnDef<ScrapeRow>[] = [
  {
    accessorKey: "index",
    header: "Row",
    cell: ({ row }) => row.original.index + 1,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "externalId",
    header: ({ column }) => <DataTableColumnHeader column={column} label="ID" />,
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.externalId || "N/A"}</span>
    ),
  },
  {
    accessorKey: "creator",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Creator" />,
    cell: ({ row }) => <span className="font-medium">{row.original.creator || "N/A"}</span>,
  },
  {
    accessorKey: "text",
    header: "Content",
    cell: ({ row }) => <div className="max-w-xl truncate">{row.original.text || "No text"}</div>,
  },
  {
    accessorKey: "path",
    header: "Source",
    cell: ({ row }) => (
      <div
        className="max-w-64 truncate font-mono text-muted-foreground text-xs"
        title={row.original.path}
      >
        {row.original.path}
      </div>
    ),
  },
];

type Props = {
  rows: ScrapeRow[];
  className?: string;
};

export function ScrapeTable({ rows, className }: Props) {
  const [filter, setFilter] = useState("");
  const [selectedRow, setSelectedRow] = useState<ScrapeRow>();
  const table = useReactTable({
    data: rows,
    columns,
    enableHiding: false,
    state: { globalFilter: filter },
    onGlobalFilterChange: setFilter,
    globalFilterFn: (row, _columnId, value: string) =>
      row.original.searchText.includes(value.toLowerCase()),
    getRowId: (row) => row.path,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 50 } },
  });
  const count = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;
  const firstRow = count ? pageIndex * pageSize + 1 : 0;
  const lastRow = Math.min((pageIndex + 1) * pageSize, count);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-medium text-sm">Records</h2>
          <span className="text-muted-foreground text-xs tabular-nums">
            {filter
              ? `${count.toLocaleString()} of ${rows.length.toLocaleString()}`
              : rows.length.toLocaleString()}{" "}
            records
          </span>
        </div>
        <Input
          aria-label="Search JSON records"
          placeholder="Search all JSON fields..."
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value);
            table.setPageIndex(0);
          }}
          className="w-full sm:w-64"
        />
      </div>
      <ScrollArea
        className="mt-2 min-h-0 flex-1"
        viewportProps={{ className: "overscroll-contain", "aria-label": "Scrape records" }}
      >
        <div className="**:data-[slot=table-container]:overflow-visible">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-muted-foreground text-xs first:w-12 first:pl-0 last:pr-0"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  tabIndex={0}
                  aria-label={`View JSON for row ${row.original.index + 1}`}
                  aria-haspopup="dialog"
                  className="cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2"
                  onClick={() => setSelectedRow(row.original)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedRow(row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "py-3 first:pl-0 last:pr-0",
                        cell.column.id === "index" && "text-muted-foreground text-xs tabular-nums",
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {count === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {rows.length ? "No matching records." : "This file contains no records."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex shrink-0 items-center justify-end gap-3 px-6 py-4 text-muted-foreground sm:px-8">
        <span className="mr-auto text-xs tabular-nums">
          {firstRow.toLocaleString()}–{lastRow.toLocaleString()} of {count.toLocaleString()}
        </span>
        <span className="text-xs tabular-nums">
          Page {count ? table.getState().pagination.pageIndex + 1 : 0} of {table.getPageCount()}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Previous page"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Next page"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          <ChevronRight />
        </Button>
      </div>
      <ScrapeRowSheet row={selectedRow} onClose={() => setSelectedRow(undefined)} />
    </div>
  );
}
