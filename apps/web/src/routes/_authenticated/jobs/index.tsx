import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { JobSchemas } from "@workspace/contracts/job";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { JobCancelAllButton } from "@/modules/jobs/components/buttons/cancel-all";
import { ReclaimButton } from "@/modules/jobs/components/buttons/reclaim";
import { JobRefreshButton } from "@/modules/jobs/components/buttons/refresh";
import { JobTable } from "@/modules/jobs/components/job-table";

const searchSchema = JobSchemas.list.request.extend({
  view: z.enum(["analytics", "table"]).optional().default("analytics"),
});

export const Route = createFileRoute("/_authenticated/jobs/")({
  component: JobList,
  validateSearch: searchSchema,
});

function JobList() {
  const search = Route.useSearch();

  const jobQuery = useQuery(orpc.job.list.queryOptions({ input: search }));

  return (
    <Main className="flex h-full flex-col p-0">
      <div className="flex items-center justify-between border-border/50 border-b px-6 py-4">
        <div className="flex items-center space-x-2">
          <ReclaimButton />

          <JobRefreshButton />

          <JobCancelAllButton />
        </div>
      </div>

      <ScrollArea className="min-h-0">
        <JobTable
          className="p-6 pt-2"
          items={jobQuery.data?.items || []}
          totalCount={jobQuery.data?.total ?? 0}
          totalPages={jobQuery.data?.totalPages ?? 0}
          isLoading={jobQuery.isLoading}
          perPage={search.perPage}
        />
      </ScrollArea>
    </Main>
  );
}
