import { useMutation } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";

export function SyncButton() {
  const mutation = useMutation(
    orpc.imdb.sync.mutationOptions({
      onSuccess: () => {
        toast.success("IMDb sync job queued");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-[10px] uppercase tracking-widest"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({})}
    >
      <RotateCcw className="mr-2" />
      <span className="pt-0.5">Sync</span>
    </Button>
  );
}
