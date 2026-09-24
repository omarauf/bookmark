import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrapeSchemas } from "@workspace/contracts/scrape";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { JobScrapeCancelButton } from "@/modules/jobs/components/buttons/cancel-scrape";
import { ProcessScrapeButton } from "@/modules/jobs/components/buttons/process-scrape";
import { JobTable } from "@/modules/jobs/components/job-table";
import { JobScrapeAnalytics } from "@/modules/jobs/views/job-scrape-analytics";

export const Route = createFileRoute("/_authenticated/scrapes/$id")({
  component: ScrapeDetailPage,
  validateSearch: ScrapeSchemas.jobs.request.omit({ id: true }),
});

function ScrapeDetailPage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();

  const scrapeQuery = useQuery(orpc.scrape.get.queryOptions({ input: { id } }));
  const jobsQuery = useQuery(orpc.scrape.jobs.queryOptions({ input: { ...search, id } }));

  return (
    <Main className="flex h-full flex-col p-0">
      <div className="flex items-center justify-between border-border/50 border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" asChild>
            <Link to="/scrapes">
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <h1 className="font-medium text-lg tracking-tight">
              {scrapeQuery.data?.filename ?? "Scrape"}
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ProcessScrapeButton scrapeId={id} />
          <JobScrapeCancelButton scrapeId={id} />
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-6 p-6">
          <JobScrapeAnalytics scrapeId={id} />

          <JobTable
            className=""
            items={jobsQuery.data?.items || []}
            totalCount={jobsQuery.data?.total ?? 0}
            totalPages={jobsQuery.data?.totalPages ?? 0}
            isLoading={jobsQuery.isLoading}
            perPage={search.perPage}
          />
        </div>
      </ScrollArea>
    </Main>
  );
}
