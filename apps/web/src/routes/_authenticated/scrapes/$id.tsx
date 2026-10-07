import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { ScrapeContent } from "@/modules/scrapes/details/content";
import { ScrapeDetails } from "@/modules/scrapes/details/details";

export const Route = createFileRoute("/_authenticated/scrapes/$id")({
  component: ScrapeDetailPage,
  loader: async ({ params, context: { orpc, queryClient } }) => {
    await queryClient.ensureQueryData(orpc.scrape.get.queryOptions({ input: { id: params.id } }));
  },
});

function ScrapeDetailPage() {
  const { id } = Route.useParams();

  const { data: scrape } = useSuspenseQuery(orpc.scrape.get.queryOptions({ input: { id } }));

  return (
    <Main layout="fixed" className="space-y-6 px-4 pt-6" noHeader>
      <div className="flex min-w-0 shrink-0 flex-wrap items-center gap-2">
        <Button
          render={<Link to="/scrapes" />}
          variant="ghost"
          size="icon-sm"
          aria-label="Back to scrapes"
        >
          <ArrowLeft />
        </Button>
        <h1 className="min-w-0 max-w-full flex-1 truncate font-medium text-lg tracking-tight sm:flex-none">
          {scrape.filename}
        </h1>
        <span className="text-muted-foreground text-xs capitalize">{scrape.platform}</span>
        <span className="ml-auto flex items-center gap-1.5 text-sm">
          {scrape.processedAt && <Check className="size-4 text-primary" aria-hidden="true" />}
          {scrape.processedAt ? "Processed" : "Unprocessed"}
        </span>
      </div>

      <ScrapeDetails scrape={scrape} />

      <ScrapeContent id={id} platform={scrape.platform} />
    </Main>
  );
}
