import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { IngestSchemas } from "@workspace/contracts/ingest";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { JobIngestCancelButton } from "@/modules/jobs/components/buttons/cancel-ingest";
import { JobTable } from "@/modules/jobs/components/job-table";
import { JobIngestAnalytics } from "@/modules/jobs/views/job-ingest-analytics";

export const Route = createFileRoute("/_authenticated/ingests/$id")({
  component: IngestDetailPage,
  validateSearch: IngestSchemas.jobs.request.omit({ id: true }),
});

function IngestDetailPage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();

  const ingestQuery = useQuery(orpc.ingest.get.queryOptions({ input: { id } }));
  const jobsQuery = useQuery(orpc.ingest.jobs.queryOptions({ input: { ...search, id } }));

  return (
    <Main className="flex h-full flex-col p-0">
      <div className="flex items-center justify-between border-border/50 border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" asChild>
            <Link to="/ingests">
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <h1 className="font-medium text-lg tracking-tight">
              {ingestQuery.data?.filename ?? "Ingest"}
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{id}</p>
          </div>
        </div>

        <JobIngestCancelButton ingestId={id} />
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-6 p-6">
          <JobIngestAnalytics ingestId={id} />

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
