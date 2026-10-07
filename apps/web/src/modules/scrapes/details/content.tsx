import { useQuery } from "@tanstack/react-query";
import type { Platform } from "@workspace/contracts/platform";
import { useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/integrations/orpc";
import { cn } from "@/lib/utils";
import { parseScrapeRows } from "./parse";
import { ScrapeTable } from "./table";

type Props = {
  id: string;
  platform: Platform;
  className?: string;
};

export function ScrapeContent({ id, platform, className }: Props) {
  const select = useCallback(
    ({ content }: { content: string }) => parseScrapeRows(content, platform),
    [platform],
  );
  const query = useQuery({
    ...orpc.scrape.content.queryOptions({ input: { id } }),
    select,
    staleTime: Infinity,
    retry: false,
  });

  if (query.isPending) {
    return (
      <div
        className={cn("flex flex-col gap-3 p-6", className)}
        role="status"
        aria-label="Loading scrape file"
      >
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-64 w-full" />
        <span className="sr-only">Loading scrape file</span>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className={cn("p-6", className)}>
        <Alert variant="destructive">
          <AlertTitle>Could not load the scrape file</AlertTitle>
          <AlertDescription>{query.error.message}</AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-fit"
            onClick={() => void query.refetch()}
          >
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  return <ScrapeTable key={id} rows={query.data} className={className} />;
}
