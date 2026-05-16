import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";

type Props = {
  groupId: string;
};

export function JobGroupCancelButton({ groupId }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: stats } = useQuery(
    orpc.job.group.stats.queryOptions({
      input: { groupId },
      refetchInterval: 2000,
      staleTime: 0,
    }),
  );

  const cancelMutation = useMutation(
    orpc.job.group.cancel.mutationOptions({
      onSuccess: ({ cancelled }) => {
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: orpc.job.group.get.key() });
        queryClient.invalidateQueries({ queryKey: orpc.job.group.stats.key() });
        queryClient.invalidateQueries({ queryKey: orpc.job.group.list.key() });
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
        size="sm"
        className="text-[10px] text-destructive uppercase tracking-widest hover:text-destructive"
        disabled={cancelMutation.isPending || active === 0}
        onClick={() => setOpen(true)}
      >
        <Ban className="mr-2" />
        <span className="pt-0.5">Cancel group</span>
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Cancel job group?"
        desc={`This will cancel ${active} active job(s). Completed and failed jobs are not affected.`}
        confirmText="Cancel jobs"
        destructive
        isLoading={cancelMutation.isPending}
        handleConfirm={() => cancelMutation.mutate({ groupId })}
        className="sm:max-w-sm"
      />
    </>
  );
}
