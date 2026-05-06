import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";

export function ReclaimButton() {
  const queryClient = useQueryClient();

  const reclaimStaleMutation = useMutation(
    orpc.job.reclaimStale.mutationOptions({
      onSuccess: ({ reclaimed }) => {
        queryClient.invalidateQueries({ queryKey: orpc.job.list.key() });
        queryClient.invalidateQueries({ queryKey: orpc.job.stats.key() });
        queryClient.invalidateQueries({ queryKey: orpc.job.analytics.key() });
        toast.success(
          reclaimed > 0 ? `Recovered ${reclaimed} stale job(s)` : "No stale jobs found",
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="text-[10px] uppercase tracking-widest"
      disabled={reclaimStaleMutation.isPending}
      onClick={() => reclaimStaleMutation.mutate({ stalledMinutes: 60 })}
    >
      <RefreshCcw className={reclaimStaleMutation.isPending ? "mr-2 animate-spin" : "mr-2"} />
      Recover Stale
    </Button>
  );
}
