import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type Import, ListImportSchema } from "@workspace/contracts/import";
import { DataTable, DataTableToolbar } from "@workspace/ui/table";
import type { DataTableRowAction } from "@workspace/ui/types/data-table";
import React from "react";
import { orpc } from "@/api/rpc";
import { useGetImportTableColumns } from "@/apps/imports/column";
import { DeleteImportsDialog } from "@/apps/imports/delete";
import { UploadButton } from "@/apps/imports/upload";
import { useDataTable } from "@/hooks/use-data-table";

export const Route = createFileRoute("/imports/")({
  component: ImportList,
  validateSearch: ListImportSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { orpc, queryClient }, deps }) => {
    await queryClient.ensureQueryData(orpc.imports.list.queryOptions({ input: deps }));
    return;
  },
});

export function ImportList() {
  const queryClient = useQueryClient();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const importQuery = useSuspenseQuery(orpc.imports.list.queryOptions({ input: search }));

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Import>>();

  const columns = useGetImportTableColumns({ setRowAction });

  const { table } = useDataTable({
    data: importQuery.data,
    rowCount: importQuery.data.length,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
    search,
    navigate,
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
