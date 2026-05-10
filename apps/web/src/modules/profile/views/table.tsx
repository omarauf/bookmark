import { useQuery } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import type { Profile } from "@workspace/contracts/views/profile";
import { User } from "lucide-react";
import { useMemo } from "react";
import { staticFile } from "@/api/static-file";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDataTable } from "@/hooks/use-data-table";
import { orpc } from "@/integrations/orpc";
import { cn } from "@/lib/utils";
import { fDate } from "@/utils/format-time";
import { platformStyles } from "../badges/platform";

function getColumns(): ColumnDef<Profile>[] {
  return [
    {
      id: "avatar",
      header: () => null,
      cell: ({ row }) => (
        <Avatar className="h-8 w-8">
          <AvatarImage src={staticFile(row.original.avatar)} alt={row.original.username} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      ),
      enableSorting: false,
      size: 48,
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Name" />,
      cell: ({ row }) => (
        <Link
          to="/profiles/$id"
          params={{ id: row.original.id }}
          className="flex flex-col hover:underline"
        >
          <span className="font-medium text-sm">{row.original.name}</span>
          <span className="text-muted-foreground text-xs">@{row.original.username}</span>
        </Link>
      ),
      enableSorting: false,
    },
    {
      id: "platform",
      accessorKey: "platform",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Platform" />,
      cell: ({ row }) => {
        const style = platformStyles[row.original.platform];
        return (
          <Badge variant="outline" className={cn("font-semibold text-[10px]", style.badge)}>
            {style.label}
          </Badge>
        );
      },
      enableSorting: false,
    },
    {
      id: "postCount",
      accessorKey: "postCount",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Posts" />,
      cell: ({ row }) => <span className="text-sm">{row.original.postCount ?? 0}</span>,
      enableSorting: false,
    },
    {
      id: "tagCount",
      accessorKey: "tagCount",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Tags" />,
      cell: ({ row }) => <span className="text-sm">{row.original.tagCount ?? 0}</span>,
      enableSorting: false,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Created" />,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted-foreground text-sm">
          {fDate(row.original.createdAt)}
        </span>
      ),
      enableSorting: false,
    },
  ];
}

export function ProfileTable() {
  const search = useSearch({ from: "/_authenticated/profiles/" });

  const query = useQuery(orpc.profile.list.queryOptions({ input: search }));

  const columns = useMemo(() => getColumns(), []);

  const { table } = useDataTable({
    data: query.data?.items ?? [],
    columns,
    pageCount: query.data?.totalPages ?? 0,
    rowCount: query.data?.total ?? 0,
    getRowId: (row) => row.id,
    initialState: {
      columnVisibility: {},
    },
  });

  return (
    <ScrollArea className="min-h-0" viewportProps={{ className: "p-4" }}>
      <DataTable table={table}>{/* Toolbar could go here */}</DataTable>
    </ScrollArea>
  );
}
