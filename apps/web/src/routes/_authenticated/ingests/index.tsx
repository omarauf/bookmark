import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type Ingest, IngestSchemas } from "@workspace/contracts/ingest";
import React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { orpc } from "@/integrations/orpc";
import { useGetIngestTableColumns } from "@/modules/ingests/column";
import { DeleteIngestsDialog } from "@/modules/ingests/delete";
import { UploadButton } from "@/modules/ingests/upload";
import type { DataTableRowAction } from "@/types/data-table";

export const Route = createFileRoute("/_authenticated/ingests/")({
  component: IngestList,
  validateSearch: IngestSchemas.list.request,
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { orpc, queryClient }, deps }) => {
    await queryClient.ensureQueryData(orpc.ingest.list.queryOptions({ input: deps }));
    return;
  },
});

function IngestList() {
  const queryClient = useQueryClient();
  const search = Route.useSearch();

  const ingestQuery = useSuspenseQuery(orpc.ingest.list.queryOptions({ input: search }));

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Ingest>>();

  const columns = useGetIngestTableColumns({ setRowAction });

  const { table } = useDataTable({
    data: ingestQuery.data.items,
    rowCount: ingestQuery.data.total,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
  });

  return (
    <div className="p-4">
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <UploadButton />
        </DataTableToolbar>
      </DataTable>

      <DeleteIngestsDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(undefined)}
        ingests={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => {
          rowAction?.row.toggleSelected(false);
          queryClient.invalidateQueries({ queryKey: ["ingests"] });
        }}
      />
    </div>
  );
}
