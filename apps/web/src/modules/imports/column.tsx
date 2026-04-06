import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Column, ColumnDef } from "@tanstack/react-table";
import type { Import } from "@workspace/contracts/import";
import { PlatformValues } from "@workspace/contracts/platform";
import { Ellipsis, Text } from "lucide-react";
import type * as React from "react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label-2";
import { orpc } from "@/integrations/orpc";
import type { DataTableRowAction } from "@/types/data-table";
import { fNumber, fSize } from "@/utils/format-number";
import { fDate } from "@/utils/format-time";

type Props = {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Import> | undefined>>;
};

export function useGetImportTableColumns({ setRowAction }: Props): ColumnDef<Import>[] {
  const queryClient = useQueryClient();

  const runImportMutation = useMutation(
    orpc.import.import.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.import.list.key() });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const importFileHandler = useCallback(
    async (id: string) => {
      const result = runImportMutation.mutateAsync({ id });
      toast.promise(result, {
        loading: "Importing...",
        success: ({ valid }) => `Successfully imported ${fNumber(valid)} posts.`,
        error: "Error importing posts",
      });
    },
    [runImportMutation],
  );

  const columns = useMemo<ColumnDef<Import>[]>(
    () => [
      // {
      //   id: "select",
      //   header: ({ table }) => (
      //     <Checkbox
      //       checked={
      //         table.getIsAllPageRowsSelected() ||
      //         (table.getIsSomePageRowsSelected() && "indeterminate")
      //       }
      //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      //       aria-label="Select all"
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       checked={row.getIsSelected()}
      //       onCheckedChange={(value) => row.toggleSelected(!!value)}
      //       aria-label="Select row"
      //     />
      //   ),
      //   size: 32,
      //   enableSorting: false,
      //   enableHiding: false,
      // },
      {
        id: "filename",
        accessorKey: "filename",
        header: ({ column }: { column: Column<Import, unknown> }) => (
          <DataTableColumnHeader column={column} label="File Name" />
        ),
        cell: ({ cell }) => <div>{cell.getValue<Import["filename"]>()}</div>,
        meta: {
          label: "File Name",
          placeholder: "Search file names...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "platform",
        accessorKey: "platform",
        header: ({ column }: { column: Column<Import, unknown> }) => (
          <DataTableColumnHeader column={column} label="Type" />
        ),
        cell: ({ cell }) => <div>{cell.getValue<Import["platform"]>()}</div>,
        meta: {
          label: "Type",
          placeholder: "Search types...",
          variant: "select",
          options: PlatformValues.map((t) => ({ label: t, value: t })),
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "validPost",
        accessorKey: "validPost",
        header: ({ column }: { column: Column<Import, unknown> }) => (
          <DataTableColumnHeader column={column} label="Valid Post Count" />
        ),
        cell: ({ cell }) => {
          const validPosts = cell.getValue<Import["validItem"]>();
          const invalidPosts = cell.row.original.invalidItem;

          return `${fNumber(validPosts)} / ${fNumber(validPosts + invalidPosts)}`;
        },
      },
      {
        id: "size",
        accessorKey: "size",
        header: ({ column }: { column: Column<Import, unknown> }) => (
          <DataTableColumnHeader column={column} label="Size" />
        ),
        cell: ({ cell }) => {
          const size = cell.getValue<Import["size"]>();
          return fSize(size / 1024);
        },
      },
      {
        id: "imported",
        accessorKey: "importedAt",
        header: ({ column }: { column: Column<Import, unknown> }) => (
          <DataTableColumnHeader column={column} label="Imported" />
        ),
        cell: ({ cell }) => {
          const s = cell.getValue<Import["importedAt"]>();

          return (
            <Label variant="soft" className="capitalize">
              {s ? "Yes" : "No"}
            </Label>
          );
        },
      },
      {
        id: "scrapedAt",
        accessorKey: "scrapedAt",
        header: ({ column }: { column: Column<Import, unknown> }) => (
          <DataTableColumnHeader column={column} label="Scraped At" />
        ),
        cell: ({ cell }) => {
          const s = cell.getValue<Import["scrapedAt"]>();

          return (
            <Label variant="soft" className="capitalize">
              {fDate(s)}
            </Label>
          );
        },
      },
      {
        id: "actions",
        cell: function Cell({ row }) {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="float-right flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <Ellipsis className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onSelect={() => importFileHandler(row.original.id)}>
                  Import
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setRowAction({ row, variant: "delete" })}>
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 40,
      },
    ],
    [importFileHandler, setRowAction],
  );

  return columns;
}
