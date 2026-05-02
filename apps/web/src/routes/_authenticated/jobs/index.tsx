import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { Job } from "@workspace/contracts/job";
import { JobSchemas } from "@workspace/contracts/job";
import { RefreshCcw } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDataTable } from "@/hooks/use-data-table";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { useGetJobTableColumns } from "@/modules/jobs/column";
import { JobLogsDialog } from "@/modules/jobs/job-logs-dialog";

export const Route = createFileRoute("/_authenticated/jobs/")({
  component: JobList,
  validateSearch: JobSchemas.list.request,
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { orpc, queryClient }, deps }) => {
    await queryClient.ensureQueryData(orpc.job.list.queryOptions({ input: deps }));
    return;
  },
});

function JobList() {
  const queryClient = useQueryClient();
  const search = Route.useSearch();
  const jobQuery = useSuspenseQuery(
    orpc.job.list.queryOptions({ input: search as z.infer<typeof JobSchemas.list.request> }),
  );

  const reclaimStaleMutation = useMutation(
    orpc.job.reclaimStale.mutationOptions({
      onSuccess: ({ reclaimed }) => {
        queryClient.invalidateQueries({ queryKey: orpc.job.list.key() });
        queryClient.invalidateQueries({ queryKey: orpc.job.stats.key() });
        toast.success(
          reclaimed > 0 ? `Recovered ${reclaimed} stale job(s)` : "No stale jobs found",
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const [logJob, setLogJob] = React.useState<Job | null>(null);
  const [logsOpen, setLogsOpen] = React.useState(false);

  const handleViewLogs = React.useCallback((job: Job) => {
    setLogJob(job);
    setLogsOpen(true);
  }, []);

  const columns = useGetJobTableColumns({ onViewLogs: handleViewLogs });

  const { table } = useDataTable({
    data: jobQuery.data.items,
    rowCount: jobQuery.data.total,
    columns,
    pageCount: jobQuery.data.totalPages,
    getRowId: (row) => row.id,
  });

  return (
    <Main className="p-2 h-full flex-col flex">
      <ScrollArea className="min-h-0 p-4">
        <DataTable table={table}>
          <DataTableToolbar table={table}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={reclaimStaleMutation.isPending}
              onClick={() => reclaimStaleMutation.mutate({ stalledMinutes: 60 })}
            >
              <RefreshCcw className={reclaimStaleMutation.isPending ? "animate-spin" : undefined} />
              Recover stale
            </Button>
          </DataTableToolbar>
        </DataTable>
      </ScrollArea>

      <JobLogsDialog job={logJob} open={logsOpen} onOpenChange={setLogsOpen} />
    </Main>
  );
}
