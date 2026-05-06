import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { JobCancelButton } from "@/modules/jobs/components/buttons/cancel";
import { JobRetryButton } from "@/modules/jobs/components/buttons/retry";
import { JobCards } from "@/modules/jobs/components/job-cards";

export const Route = createFileRoute("/_authenticated/jobs/$id")({
  component: JobDetailPage,
  loader: async ({ params, context: { orpc, queryClient } }) => {
    const id = params.id;
    await queryClient.ensureQueryData(orpc.job.get.queryOptions({ input: { id } }));
  },
});

function JobDetailPage() {
  const { id } = useParams({ from: "/_authenticated/jobs/$id" });

  const { data: job } = useSuspenseQuery(orpc.job.get.queryOptions({ input: { id } }));

  return (
    <Main className="flex h-full flex-col p-0">
      {/* Header */}
      <div className="flex items-center justify-between border-border/50 border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/jobs">
            <Button variant="ghost" size="sm" className="px-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-medium text-lg tracking-tight">Job Detail</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{job.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <JobRetryButton job={job} />
          <JobCancelButton job={job} />
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
          {/* Left Column — Metadata + Timeline */}
          <div className="space-y-6 lg:col-span-1">
            <JobCards.Metadata job={job} />

            <JobCards.Timeline job={job} />
          </div>

          {/* Right Column — Progress + Error + Logs */}
          <div className="space-y-6 lg:col-span-2">
            <JobCards.Progress job={job} />

            <JobCards.Error job={job} />

            <JobCards.Log job={job} />
          </div>
        </div>
      </ScrollArea>
    </Main>
  );
}
