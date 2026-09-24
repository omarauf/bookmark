import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";

type Props = {
  ingestId: string;
};

export function IngestButton({ ingestId }: Props) {
  const queryClient = useQueryClient();

  const runIngestMutation = useMutation(
    orpc.ingest.ingest.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.ingest.list.key() });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const ingestFileHandler = useCallback(
    async (id: string) => {
      const result = runIngestMutation.mutateAsync({ id });
      toast.promise(result, {
        loading: "Ingesting...",
        success: ({ jobId }) => `Ingest started (Job ID: ${jobId})`,
        error: "Error ingesting posts",
      });
    },
    [runIngestMutation],
  );

  return (
    <Button size="sm" onSelect={() => ingestFileHandler(ingestId)}>
      Ingest
    </Button>
  );
}
