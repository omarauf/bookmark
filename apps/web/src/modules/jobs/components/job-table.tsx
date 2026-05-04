import type { Job } from "@workspace/contracts/job";
import { useCallback, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useGetJobTableColumns } from "@/modules/jobs/column";
import { JobLogsDialog } from "@/modules/jobs/job-logs-dialog";

type Props = {
  className?: string;
  items: Job[];
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  perPage?: number;
};

export function JobTable({ className, items, totalCount, totalPages, isLoading, perPage }: Props) {
  const [logJob, setLogJob] = useState<Job>();
  const [logsOpen, setLogsOpen] = useState(false);

  const handleViewLogs = useCallback((job: Job) => {
    setLogJob(job);
    setLogsOpen(true);
  }, []);

  const columns = useGetJobTableColumns({ onViewLogs: handleViewLogs });

  const { table } = useDataTable({
    data: items,
    rowCount: totalCount,
    columns,
    pageCount: totalPages,
    getRowId: (row) => row.id,
  });

  if (isLoading) {
    return (
      <DataTableSkeleton
        className={className}
        columnCount={6}
        rowCount={perPage ?? 10}
        filterCount={3}
        cellWidths={["40px", "900px", "300px", "200px", "150px", "50px"]}
      />
    );
  }

  return (
    <>
      <DataTable table={table} className={className}>
        <DataTableToolbar table={table} />
      </DataTable>

      <JobLogsDialog job={logJob} open={logsOpen} onOpenChange={setLogsOpen} />
    </>
  );
}
