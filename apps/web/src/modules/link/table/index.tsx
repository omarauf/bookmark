import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import type { Link, ListLink } from "@workspace/contracts/link";
import { Suspense, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDataTable } from "@/hooks/use-data-table";
import { orpc } from "@/integrations/orpc";
import type { DataTableRowAction } from "@/types/data-table";
import { DeleteLinksDialog } from "../dialogs/delete-dialog";
import { useLinkTableColumns } from "./columns";

function InnerLinkTable({ search }: { search: ListLink }) {
  const [rowAction, setRowAction] = useState<DataTableRowAction<Link> | undefined>();

  const linkQuery = useSuspenseQuery(orpc.link.list.queryOptions({ input: search }));

  const folderQuery = useSuspenseQuery(orpc.link.folderList.queryOptions());

  const columns = useLinkTableColumns({ setRowAction, folderPaths: folderQuery.data });

  const { table } = useDataTable({
    data: linkQuery.data.items,
    rowCount: linkQuery.data.total,
    columns,
    pageCount: linkQuery.data.totalPages,
    getRowId: (row) => row.id,
    // queryKeys: {
    //   page: "page",
    //   perPage: "perPage",
    // },
  });

  return (
    <div className="flex min-h-0">
      <ScrollArea className="w-full">
        <DataTable table={table} className="p-4">
          <DataTableToolbar table={table} />
          <p>{linkQuery.data.items.length}</p>
        </DataTable>

        {rowAction?.variant === "delete" && (
          <DeleteLinksDialog
            open
            onOpenChange={() => setRowAction(undefined)}
            linkIds={[rowAction.row.original.id]}
            showTrigger={false}
          />
        )}
      </ScrollArea>
    </div>
  );
}

export function LinkTable() {
  const search = useSearch({ from: "/_authenticated/links/" });

  if (search.view !== "table") {
    throw new Error("LinkTable should only be used with view=table");
  }

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          className="p-4"
          columnCount={6}
          rowCount={20}
          filterCount={3}
          cellWidths={["40px", "900px", "300px", "200px", "150px", "50px"]}
        />
      }
    >
      <InnerLinkTable search={search} />
    </Suspense>
  );
}
