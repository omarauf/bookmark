import type { Column, ColumnDef } from "@tanstack/react-table";
import type { Link } from "@workspace/contracts/link";
import { ExternalLink, Globe, MoreHorizontal, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableRowAction } from "@/types/data-table";
import { fDate } from "@/utils/format-time";

type Props = {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Link> | undefined>>;
  folderPaths: { path: string; name: string }[];
};

export function useLinkTableColumns({ setRowAction, folderPaths }: Props): ColumnDef<Link>[] {
  const columns = useMemo<ColumnDef<Link>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      },
      {
        id: "caption",
        accessorKey: "caption",
        header: ({ column }: { column: Column<Link, unknown> }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ row }) => {
          const link = row.original;
          const favicon = link.preview?.favicons?.[0];
          const caption = link.caption;
          const domain = (() => {
            try {
              return new URL(link.url).hostname.replace(/^www\./, "");
            } catch {
              return link.url;
            }
          })();

          return (
            <div className="flex min-w-0 items-center gap-2">
              {favicon ? (
                <img src={favicon} alt="" className="h-4 w-4 shrink-0 rounded-sm" loading="lazy" />
              ) : (
                <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-sm">{caption || domain}</div>
                {caption && <div className="truncate text-muted-foreground text-xs">{domain}</div>}
              </div>
            </div>
          );
        },
        // meta: {
        //   label: "Title",
        //   placeholder: "Search titles...",
        //   variant: "text" as const,
        //   icon: Globe,
        // },
        // enableColumnFilter: true,
      },
      {
        id: "url",
        accessorKey: "url",
        header: ({ column }: { column: Column<Link, unknown> }) => (
          <DataTableColumnHeader column={column} label="URL" />
        ),
        cell: ({ row }) => {
          const url = row.original.url;
          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex max-w-75 items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              <span className="truncate">{url}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          );
        },
        // meta: {
        //   label: "URL",
        //   placeholder: "Search URLs...",
        //   variant: "text" as const,
        // },
        // enableColumnFilter: true,
      },
      {
        id: "path",
        accessorKey: "path",
        header: ({ column }: { column: Column<Link, unknown> }) => (
          <DataTableColumnHeader column={column} label="Path" />
        ),
        cell: ({ row }) => {
          const path = row.original.path;
          return <span className="text-muted-foreground text-sm">{path || "/"}</span>;
        },
        meta: {
          label: "Path",
          placeholder: "Filter by path...",
          variant: "select" as const,
          // options: [
          //   { label: "Home", value: "/" },
          //   { label: "Work", value: "/work" },
          //   { label: "Personal", value: "/personal" },
          // ],
          options: folderPaths?.map((folder) => ({ label: folder.name, value: folder.path })),
        },
        enableColumnFilter: true,
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }: { column: Column<Link, unknown> }) => (
          <DataTableColumnHeader column={column} label="Added" />
        ),
        cell: ({ row }) => {
          const date = row.original.createdAt;
          return (
            <span className="whitespace-nowrap text-muted-foreground text-sm">{fDate(date)}</span>
          );
        },
        meta: {
          label: "Added",
          variant: "date" as const,
        },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        header: () => null,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href={row.original.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in browser
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setRowAction({ row, variant: "delete" })}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 48,
      },
    ],
    [setRowAction, folderPaths?.map],
  );

  return columns;
}
