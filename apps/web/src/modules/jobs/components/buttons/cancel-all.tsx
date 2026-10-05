import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";

export function JobCancelAllButton() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: stats } = useQuery(
    orpc.job.stats.queryOptions({
      refetchInterval: 2000,
      staleTime: 0,
    }),
  );

  const cancelMutation = useMutation(
    orpc.job.cancelAll.mutationOptions({
      onSuccess: ({ cancelled }) => {
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: orpc.scrape.get.key() });
        queryClient.invalidateQueries({ queryKey: orpc.scrape.list.key() });
        toast.success(cancelled > 0 ? `Cancelled ${cancelled} job(s)` : "No active jobs to cancel");
      },
      onError: (error: { message: string }) => toast.error(error.message),
    }),
  );

  const active = (stats?.pending ?? 0) + (stats?.processing ?? 0) + (stats?.retrying ?? 0);

  return (
    <>
      <Button
        variant="outline"
        className="text-destructive hover:text-destructive"
        disabled={cancelMutation.isPending || active === 0}
        onClick={() => setOpen(true)}
      >
        <Ban />
        <span className="pt-0.5">Cancel All</span>
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Cancel job group?"
        desc={`This will cancel ${active} active job(s). Completed and failed jobs are not affected.`}
        confirmText="Cancel jobs"
        destructive
        isLoading={cancelMutation.isPending}
        handleConfirm={() => cancelMutation.mutate()}
        className="sm:max-w-sm"
      />
    </>
  );
}
