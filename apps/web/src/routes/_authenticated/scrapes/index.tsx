import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type Scrape, ScrapeSchemas } from "@workspace/contracts/scrape";
import React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { orpc } from "@/integrations/orpc";
import { useGetScrapeTableColumns } from "@/modules/scrapes/column";
import { DeleteScrapesDialog } from "@/modules/scrapes/delete";
import { UploadButton } from "@/modules/scrapes/upload";
import type { DataTableRowAction } from "@/types/data-table";

export const Route = createFileRoute("/_authenticated/scrapes/")({
  component: ScrapeList,
  validateSearch: ScrapeSchemas.list.request,
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { orpc, queryClient }, deps }) => {
    await queryClient.ensureQueryData(orpc.scrape.list.queryOptions({ input: deps }));
    return;
  },
});

function ScrapeList() {
  const queryClient = useQueryClient();
  const search = Route.useSearch();

  const scrapeQuery = useSuspenseQuery(orpc.scrape.list.queryOptions({ input: search }));

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Scrape>>();

  const columns = useGetScrapeTableColumns({ setRowAction });

  const { table } = useDataTable({
    data: scrapeQuery.data.items,
    rowCount: scrapeQuery.data.total,
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

      <DeleteScrapesDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(undefined)}
        scrapes={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => {
          rowAction?.row.toggleSelected(false);
          queryClient.invalidateQueries({ queryKey: ["scrapes"] });
        }}
      />
    </div>
  );
}
