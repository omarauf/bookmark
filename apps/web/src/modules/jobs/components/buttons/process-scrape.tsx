import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";

type Props = {
  scrapeId: string;
};

export function ProcessScrapeButton({ scrapeId }: Props) {
  const queryClient = useQueryClient();

  const runScrapeMutation = useMutation(
    orpc.scrape.process.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.scrape.list.key() });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const scrapeFileHandler = useCallback(
    async (id: string) => {
      const result = runScrapeMutation.mutateAsync({ id });
      toast.promise(result, {
        loading: "Processing...",
        success: ({ jobId }) => `Scrape started (Job ID: ${jobId})`,
        error: "Error processing scrape",
      });
    },
    [runScrapeMutation],
  );

  return (
    <Button size="sm" onClick={() => scrapeFileHandler(scrapeId)}>
      Process
    </Button>
  );
}
