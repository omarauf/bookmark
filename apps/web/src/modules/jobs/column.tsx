import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { Column, ColumnDef } from "@tanstack/react-table";
import type { Job } from "@workspace/contracts/job";
import { JobStatusValues, JobTypeValues } from "@workspace/contracts/job";
import { Ellipsis, List, RotateCcw, Text, XCircle } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { orpc } from "@/integrations/orpc";
import { fToNow } from "@/utils/format-time";
import { JobStatusBadge } from "./job-status-badge";

type Props = {
  onViewLogs: (job: Job) => void;
};

export function useGetJobTableColumns({ onViewLogs }: Props): ColumnDef<Job>[] {
  const queryClient = useQueryClient();

  const retryMutation = useMutation(
    orpc.job.retry.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.job.list.key() });
        toast.success("Job queued for retry");
      },
      onError: (error: { message: string }) => {
        toast.error(error.message);
      },
    }),
  );

  const cancelMutation = useMutation(
    orpc.job.cancel.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.job.list.key() });
        toast.success("Job cancelled");
      },
      onError: (error: { message: string }) => {
        toast.error(error.message);
      },
    }),
  );

  const columns = useMemo<ColumnDef<Job>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: ({ column }: { column: Column<Job, unknown> }) => (
          <DataTableColumnHeader column={column} label="ID" />
        ),
        cell: ({ row }) => (
          <Link
            to="/jobs/$id"
            params={{ id: row.original.id }}
            className="text-primary text-xs underline"
          >
            {row.original.id.slice(0, 8)}
          </Link>
        ),
        size: 100,
      },
      {
        id: "type",
        accessorKey: "type",
        header: ({ column }: { column: Column<Job, unknown> }) => (
          <DataTableColumnHeader column={column} label="Type" />
        ),
        cell: ({ cell }) => <div>{cell.getValue<Job["type"]>()}</div>,
        meta: {
          label: "Type",
          placeholder: "Search types...",
          variant: "select",
          options: JobTypeValues.map((t) => ({ label: t, value: t })),
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }: { column: Column<Job, unknown> }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => <JobStatusBadge status={cell.getValue<Job["status"]>()} />,
        meta: {
          label: "Status",
          placeholder: "Search statuses...",
          variant: "select",
          options: JobStatusValues.map((s) => ({ label: s, value: s })),
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "group",
        accessorKey: "groupId",
        header: ({ column }: { column: Column<Job, unknown> }) => (
          <DataTableColumnHeader column={column} label="Group" />
        ),
        cell: ({ row }) => {
          const groupId = row.original.groupId;
          if (!groupId) return <span className="text-muted-foreground text-xs">—</span>;
          return (
            <Link
              to="/job-groups/$id"
              params={{ id: groupId }}
              className="text-[10px] text-primary underline"
            >
              {groupId.slice(0, 8)}
            </Link>
          );
        },
        size: 80,
      },
      {
        id: "progress",
        accessorKey: "progress",
        header: ({ column }: { column: Column<Job, unknown> }) => (
          <DataTableColumnHeader column={column} label="Progress" />
        ),
        cell: ({ row }) => {
          const progress = row.original.progress;
          if (progress !== undefined) {
            return (
              <div className="flex items-center gap-2">
                <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-muted-foreground text-xs">{progress}%</span>
              </div>
            );
          }
          return <span className="text-muted-foreground text-xs">—</span>;
        },
      },
      {
        id: "attempts",
        accessorKey: "attemptCount",
        header: ({ column }: { column: Column<Job, unknown> }) => (
          <DataTableColumnHeader column={column} label="Attempts" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {row.original.attemptCount} / {row.original.maxAttempts}
          </span>
        ),
      },
      {
        id: "error",
        accessorKey: "error",
        maxSize: 20,
        header: ({ column }: { column: Column<Job, unknown> }) => (
          <DataTableColumnHeader column={column} label="Error" />
        ),
        cell: ({ cell }) => {
          const error = cell.getValue<Job["error"]>();
          if (!error) return <span className="text-muted-foreground text-xs">—</span>;
          return (
            <div className="max-w-50 overflow-hidden ">
              <span className="max-w-50 truncate text-destructive text-xs">{error}</span>
            </div>
          );
        },
      },
      {
        id: "retryAt",
        accessorKey: "retryAt",
        header: ({ column }: { column: Column<Job, unknown> }) => (
          <DataTableColumnHeader column={column} label="Retry At" />
        ),
        cell: ({ cell }) => {
          const d = cell.getValue<Job["retryAt"]>();
          return <span className="text-muted-foreground text-xs">{d ? fToNow(d) : "—"}</span>;
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }: { column: Column<Job, unknown> }) => (
          <DataTableColumnHeader column={column} label="Created" />
        ),
        cell: ({ cell }) => {
          const d = cell.getValue<Job["createdAt"]>();
          return (
            <span className="text-muted-foreground text-xs">
              {d ? new Date(d).toLocaleString() : "—"}
            </span>
          );
        },
      },
      {
        id: "actions",
        cell: function Cell({ row }) {
          const job = row.original;
          const canRetry = job.status === "failed" || job.status === "cancelled";
          const canCancel =
            job.status === "pending" || job.status === "processing" || job.status === "retrying";

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="float-right flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <Ellipsis className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onSelect={() => onViewLogs(job)}>
                  <List className="mr-2 size-4" />
                  View Logs
                </DropdownMenuItem>
                {canRetry && (
                  <DropdownMenuItem
                    onSelect={() => retryMutation.mutate({ id: job.id })}
                    disabled={retryMutation.isPending}
                  >
                    <RotateCcw className="mr-2 size-4" />
                    Retry
                  </DropdownMenuItem>
                )}
                {canCancel && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => cancelMutation.mutate({ id: job.id })}
                      disabled={cancelMutation.isPending}
                      className="text-destructive focus:text-destructive"
                    >
                      <XCircle className="mr-2 size-4" />
                      Cancel
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 40,
      },
    ],
    [onViewLogs, retryMutation, cancelMutation],
  );

  return columns;
}
