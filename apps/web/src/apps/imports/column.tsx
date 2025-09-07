import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Column, ColumnDef } from "@tanstack/react-table";
import type { Import } from "@workspace/contracts/import";
import { PlatformTypeArray } from "@workspace/contracts/platform-type";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Label } from "@workspace/ui/components/label-2";
import { DataTableColumnHeader } from "@workspace/ui/table";
import type { DataTableRowAction } from "@workspace/ui/types/data-table";
import { Ellipsis, Text } from "lucide-react";
import type * as React from "react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { orpc } from "@/api/rpc";
import { fNumber } from "@/utils/format-number";
import { fDate } from "@/utils/format-time";

type Props = {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Import> | undefined>>;
};

export function useGetImportTableColumns({ setRowAction }: Props): ColumnDef<Import>[] {
  const queryClient = useQueryClient();

  const runImportMutation = useMutation(
    orpc.imports.run.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.imports.list.key() });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const importFileHandler = useCallback(
    async (id: string, download: boolean) => {
      const result = runImportMutation.mutateAsync({ id, download });
      toast.promise(result, {
        loading: "Importing...",
        success: ({ mappedPosts, mappedUsers }) =>
          `Successfully imported ${fNumber(mappedPosts)} posts and ${fNumber(mappedUsers)} users.`,
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
        id: "name",
        accessorKey: "name",
        header: ({ column }: { column: Column<Import, unknown> }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ cell }) => <div>{cell.getValue<Import["name"]>()}</div>,
        meta: {
          label: "Name",
          placeholder: "Search names...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "type",
        accessorKey: "type",
        header: ({ column }: { column: Column<Import, unknown> }) => (
          <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ cell }) => <div>{cell.getValue<Import["type"]>()}</div>,
        meta: {
          label: "Type",
          placeholder: "Search types...",
          variant: "select",
          options: PlatformTypeArray.map((t) => ({ label: t, value: t })),
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "validPostCount",
        accessorKey: "validPostCount",
        header: ({ column }: { column: Column<Import, unknown> }) => (
          <DataTableColumnHeader column={column} title="Valid Post Count" />
        ),
        cell: ({ cell }) => {
          const validPosts = cell.getValue<Import["validPostCount"]>();
          const invalidPosts = cell.row.original.invalidPostCount;

          return `${fNumber(validPosts)} / ${fNumber(validPosts + invalidPosts)}`;
        },
      },
      {
        id: "downloaded",
        accessorKey: "downloaded",
        header: ({ column }: { column: Column<Import, unknown> }) => (
          <DataTableColumnHeader column={column} title="Downloaded" />
        ),
        cell: ({ cell }) => {
          const s = cell.getValue<Import["downloadedAt"]>();

          return (
            <Label variant="soft" className="capitalize">
              {s ? "Yes" : "No"}
            </Label>
          );
        },
      },
      {
        id: "imported",
        accessorKey: "imported",
        header: ({ column }: { column: Column<Import, unknown> }) => (
          <DataTableColumnHeader column={column} title="Imported" />
        ),
        cell: ({ cell }) => {
          const s = cell.getValue<Import["downloadedAt"]>();

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
          <DataTableColumnHeader column={column} title="Scraped At" />
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
                <DropdownMenuItem onSelect={() => importFileHandler(row.original.id, false)}>
                  Import
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => importFileHandler(row.original.id, true)}>
                  Import (Download)
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
