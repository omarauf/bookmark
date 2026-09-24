import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { PlatformValues } from "@workspace/contracts/platform";
import type { Scrape } from "@workspace/contracts/scrape";
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
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Scrape> | undefined>>;
};

export function useGetScrapeTableColumns({ setRowAction }: Props): ColumnDef<Scrape>[] {
  const queryClient = useQueryClient();

  const runScrapeMutation = useMutation(
    orpc.scrape.process.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.scrape.list.key() });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const scrapeFileHandler = useCallback(
    async (id: string) => {
      const result = runScrapeMutation.mutateAsync({ id });
      toast.promise(result, {
        loading: "Processing...",
        success: ({ jobId }) => `Scrape started (Job ID: ${jobId})`,
        error: "Error processing scrape",
      });
    },
    [runScrapeMutation],
  );

  const columns = useMemo<ColumnDef<Scrape>[]>(
    () => [
      {
        id: "filename",
        accessorKey: "filename",
        header: ({ column }: { column: Column<Scrape, unknown> }) => (
          <DataTableColumnHeader column={column} label="File Name" />
        ),
        cell: ({ cell }) => (
          <Link to="/scrapes/$id" params={{ id: cell.row.original.id }}>
            {cell.getValue<Scrape["filename"]>()}
          </Link>
        ),
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
        header: ({ column }: { column: Column<Scrape, unknown> }) => (
          <DataTableColumnHeader column={column} label="Type" />
        ),
        cell: ({ cell }) => <div>{cell.getValue<Scrape["platform"]>()}</div>,
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
        header: ({ column }: { column: Column<Scrape, unknown> }) => (
          <DataTableColumnHeader column={column} label="Valid Post Count" />
        ),
        cell: ({ cell }) => {
          const validPosts = cell.getValue<Scrape["validPost"]>();
          const invalidPosts = cell.row.original.invalidPost;

          return `${fNumber(validPosts)} / ${fNumber(validPosts + invalidPosts)}`;
        },
      },
      {
        id: "size",
        accessorKey: "size",
        header: ({ column }: { column: Column<Scrape, unknown> }) => (
          <DataTableColumnHeader column={column} label="Size" />
        ),
        cell: ({ cell }) => {
          const size = cell.getValue<Scrape["size"]>();
          return fSize(size / 1024);
        },
      },
      {
        id: "processed",
        accessorKey: "processedAt",
        header: ({ column }: { column: Column<Scrape, unknown> }) => (
          <DataTableColumnHeader column={column} label="Processed" />
        ),
        cell: ({ cell }) => {
          const s = cell.getValue<Scrape["processedAt"]>();

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
        header: ({ column }: { column: Column<Scrape, unknown> }) => (
          <DataTableColumnHeader column={column} label="Scraped At" />
        ),
        cell: ({ cell }) => {
          const s = cell.getValue<Scrape["scrapedAt"]>();

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
                <DropdownMenuItem onSelect={() => scrapeFileHandler(row.original.id)}>
                  Process
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
    [scrapeFileHandler, setRowAction],
  );

  return columns;
}
