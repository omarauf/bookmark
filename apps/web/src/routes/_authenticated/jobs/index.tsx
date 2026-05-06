import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { JobSchemas } from "@workspace/contracts/job";
import { BarChart3, List } from "lucide-react";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { ReclaimButton } from "@/modules/jobs/components/buttons/reclaim";
import { JobTable } from "@/modules/jobs/components/job-table";
import { JobAnalytics } from "@/modules/jobs/views/analytics";

const searchSchema = JobSchemas.list.request.extend({
  view: z.enum(["analytics", "table"]).optional().default("analytics"),
});

export const Route = createFileRoute("/_authenticated/jobs/")({
  component: JobList,
  validateSearch: searchSchema,
});

function JobList() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const jobQuery = useQuery(orpc.job.list.queryOptions({ input: search }));

  return (
    <Main className="flex h-full flex-col p-0">
      <Tabs
        value={search.view}
        className="flex h-full flex-col"
        onValueChange={(v) => navigate({ search: { view: v as "analytics" | "table" } })}
      >
        <div className="flex items-center justify-between border-border/50 border-b px-6 py-4">
          <TabsList className="border border-border/50 bg-transparent p-0">
            <TabsTrigger
              value="analytics"
              className="border-border/50 border-r px-4 py-2 text-[10px] uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              <BarChart3 className="mr-2 h-3.5 w-3.5" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="table"
              className="px-4 py-2 text-[10px] uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              <List className="mr-2 h-3.5 w-3.5" />
              Table
            </TabsTrigger>
          </TabsList>

          <ReclaimButton />
        </div>

        <ScrollArea className="min-h-0">
          <TabsContent value="analytics">
            <JobAnalytics className="p-6" />
          </TabsContent>

          <TabsContent value="table">
            <JobTable
              className="p-6 pt-2"
              items={jobQuery.data?.items || []}
              totalCount={jobQuery.data?.total ?? 0}
              totalPages={jobQuery.data?.totalPages ?? 0}
              isLoading={jobQuery.isLoading}
              perPage={search.perPage}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Main>
  );
}
