import { useMutation } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";

export function SyncButton() {
  const syncMutation = useMutation(orpc.anime.sync.mutationOptions());

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 border-border/50 text-[10px]"
      onClick={() => {
        syncMutation.mutate(undefined, {
          onSuccess: () => toast.success("Anime sync queued"),
          onError: () => toast.error("Failed to queue sync"),
        });
      }}
      disabled={syncMutation.isPending}
    >
      <RotateCcw className="mr-1.5 h-3 w-3" />
      Sync
    </Button>
  );
}
