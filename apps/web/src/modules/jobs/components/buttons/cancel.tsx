import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Job } from "@workspace/contracts/job";
import { Ban } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";

type Props = {
  job: Job;
};

export function JobCancelButton({ job }: Props) {
  const queryClient = useQueryClient();

  const cancelMutation = useMutation(
    orpc.job.cancel.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.job.get.key() });
        queryClient.invalidateQueries({ queryKey: orpc.job.list.key() });
        toast.success("Job cancelled");
      },
      onError: (error: { message: string }) => toast.error(error.message),
    }),
  );

  const canCancel =
    job.status === "pending" || job.status === "processing" || job.status === "retrying";

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-none font-mono text-[10px] text-destructive uppercase tracking-widest hover:text-destructive"
      disabled={cancelMutation.isPending || !canCancel}
      onClick={() => cancelMutation.mutate({ id: job.id })}
    >
      <Ban className="mr-2" />
      <span className="pt-0.5">Cancel</span>
    </Button>
  );
}
