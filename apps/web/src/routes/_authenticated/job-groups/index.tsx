import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { JobSchemas } from "@workspace/contracts/job";
import { Layers } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDataTable } from "@/hooks/use-data-table";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";

export const Route = createFileRoute("/_authenticated/job-groups/")({
  component: JobGroupList,
  validateSearch: JobSchemas.group.list.request,
});

function JobGroupList() {
  const search = Route.useSearch();

  const { data, isLoading } = useQuery(orpc.job.group.list.queryOptions({ input: search }));

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: { row: { original: { id: string; name: string } } }) => (
        <Link
          to="/job-groups/$id"
          params={{ id: row.original.id }}
          className="text-primary text-xs underline"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }: { row: { original: { createdAt: Date } } }) => (
        <span className="text-muted-foreground text-xs">
          {new Date(row.original.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }: { row: { original: { updatedAt: Date } } }) => (
        <span className="text-muted-foreground text-xs">
          {new Date(row.original.updatedAt).toLocaleString()}
        </span>
      ),
    },
  ];

  const { table } = useDataTable({
    data: data?.items || [],
    rowCount: data?.total ?? 0,
    columns,
    pageCount: data?.totalPages ?? 0,
    getRowId: (row) => row.id,
  });

  return (
    <Main className="flex h-full flex-col p-0">
      <div className="border-border/50 border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <h1 className="font-medium text-lg tracking-tight">Job Groups</h1>
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground uppercase tracking-widest">
          {data?.total ?? 0} GROUPS REGISTERED
        </p>
      </div>

      <ScrollArea className="min-h-0 flex-1 p-4">
        {!isLoading && (
          <DataTable table={table}>
            <DataTableToolbar table={table} hideViewOptions />
          </DataTable>
        )}

        {isLoading && (
          <DataTableSkeleton
            columnCount={3}
            rowCount={search.perPage ?? 10}
            filterCount={3}
            cellWidths={["200px", "150px", "50px"]}
          />
        )}
      </ScrollArea>
    </Main>
  );
}
