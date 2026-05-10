import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RefreshButton } from "@/components/refresh-button";
import { orpc } from "@/integrations/orpc";

export function JobRefreshButton() {
  const queryClient = useQueryClient();

  const onClick = async () => {
    await queryClient.invalidateQueries({ queryKey: orpc.job.list.key() });
    await queryClient.invalidateQueries({ queryKey: orpc.job.stats.key() });
    await queryClient.invalidateQueries({ queryKey: orpc.job.analytics.key() });
    toast.success("Refreshed job list");
  };

  return <RefreshButton onRefresh={onClick} />;
}
