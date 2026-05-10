import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { JobSchemas } from "@workspace/contracts/job";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { JobTable } from "@/modules/jobs/components/job-table";
import { JobGroupAnalytics } from "@/modules/jobs/views/job-group-analytics";

export const Route = createFileRoute("/_authenticated/job-groups/$id")({
  component: JobGroupDetailPage,
  validateSearch: JobSchemas.group.get.request.omit({ id: true }),
});

function JobGroupDetailPage() {
  const { id } = useParams({ from: "/_authenticated/job-groups/$id" });
  const search = Route.useSearch();

  const jobsQuery = useQuery(orpc.job.group.get.queryOptions({ input: { ...search, id } }));

  return (
    <Main className="flex h-full flex-col p-0">
      {/* Header */}
      <div className="flex items-center justify-between border-border/50 border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" asChild>
            <Link to="/job-groups">
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <h1 className="font-medium text-lg tracking-tight">{jobsQuery.data?.group.name}</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              {jobsQuery.data?.group.id}
            </p>
          </div>
        </div>
      </div>

      <pre>{JSON.stringify(search, null, 2)}</pre>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-6 p-6">
          <JobGroupAnalytics groupId={id} />

          <JobTable
            className=""
            items={jobsQuery.data?.jobs.items || []}
            totalCount={jobsQuery.data?.jobs.total ?? 0}
            totalPages={jobsQuery.data?.jobs.totalPages ?? 0}
            isLoading={jobsQuery.isLoading}
            perPage={search.perPage}
          />
        </div>
      </ScrollArea>
    </Main>
  );
}
