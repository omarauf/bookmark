import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type Import, ImportSchemas } from "@workspace/contracts/import";
import React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { orpc } from "@/integrations/orpc";
import { useGetImportTableColumns } from "@/modules/imports/column";
import { DeleteImportsDialog } from "@/modules/imports/delete";
import { UploadButton } from "@/modules/imports/upload";
import type { DataTableRowAction } from "@/types/data-table";

export const Route = createFileRoute("/_authenticated/imports/")({
  component: ImportList,
  validateSearch: ImportSchemas.list.request,
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { orpc, queryClient }, deps }) => {
    await queryClient.ensureQueryData(orpc.import.list.queryOptions({ input: deps }));
    return;
  },
});

function ImportList() {
  const queryClient = useQueryClient();
  const search = Route.useSearch();

  const importQuery = useSuspenseQuery(orpc.import.list.queryOptions({ input: search }));

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Import>>();

  const columns = useGetImportTableColumns({ setRowAction });

  const { table } = useDataTable({
    data: importQuery.data.items,
    rowCount: importQuery.data.total,
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

      <DeleteImportsDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(undefined)}
        imports={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => {
          rowAction?.row.toggleSelected(false);
          queryClient.invalidateQueries({ queryKey: ["imports"] });
        }}
      />
    </div>
  );
}
