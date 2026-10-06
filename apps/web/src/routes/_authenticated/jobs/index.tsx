import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { JobSchemas } from "@workspace/contracts/job";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { JobTable } from "@/modules/jobs/components/job-table";
import { JobFilter } from "@/modules/jobs/filter";

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
    <Main
      layout="fixed"
      className="min-h-0 min-w-0 flex-col p-0 md:flex-row"
      headerClassName="border-b"
    >
      <JobFilter />

      <ScrollArea className="min-h-0 min-w-0 flex-1">
        <JobTable
          className="p-4"
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
