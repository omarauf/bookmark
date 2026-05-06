import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Job } from "@workspace/contracts/job";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";

type Props = {
  job: Job;
};

export function JobRetryButton({ job }: Props) {
  const queryClient = useQueryClient();

  const retryMutation = useMutation(
    orpc.job.retry.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.job.get.key() });
        queryClient.invalidateQueries({ queryKey: orpc.job.list.key() });
        toast.success("Job queued for retry");
      },
      onError: (error: { message: string }) => toast.error(error.message),
    }),
  );

  const canRetry = job.status === "failed" || job.status === "cancelled";

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-[10px] uppercase tracking-widest"
      disabled={retryMutation.isPending || !canRetry}
      onClick={() => retryMutation.mutate({ id: job.id })}
    >
      <RotateCcw className="mr-2" />
      <span className="pt-0.5">Retry</span>
    </Button>
  );
}
