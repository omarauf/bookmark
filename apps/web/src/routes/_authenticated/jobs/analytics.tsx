import { createFileRoute } from "@tanstack/react-router";
import { JobSchemas } from "@workspace/contracts/job";
import { Main } from "@/layout/main";
import { ReclaimButton } from "@/modules/jobs/components/buttons/reclaim";
import { JobRefreshButton } from "@/modules/jobs/components/buttons/refresh";
import { JobAnalytics } from "@/modules/jobs/views/analytics";

export const Route = createFileRoute("/_authenticated/jobs/analytics")({
  component: RouteComponent,
  validateSearch: JobSchemas.list.request,
});

function RouteComponent() {
  return (
    <Main className="flex h-full flex-col p-0">
      <div className="flex items-center justify-between border-border/50 border-b px-6 py-4">
        <div className="flex items-center space-x-2">
          <ReclaimButton />

          <JobRefreshButton />
        </div>
      </div>

      <JobAnalytics className="p-6" />
    </Main>
  );
}
