import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { JobSchemas } from "@workspace/contracts/job";
import { Loader } from "lucide-react";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { StatsOverview } from "@/modules/download-task/stats-overview";
import { DownloadTaskItem } from "@/modules/download-task/task-item";

export const Route = createFileRoute("/_authenticated/downloads/")({
  validateSearch: JobSchemas.list.request,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const input = { ...deps, type: "download_media" as const };

    await context.queryClient.prefetchInfiniteQuery(
      orpc.job.list.infiniteOptions({
        initialPageParam: 1,
        input: (page) => ({ ...input, page, perPage: 30 }),
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
      }),
    );

    await context.queryClient.ensureQueryData(
      orpc.job.stats.queryOptions({ input: { type: "download_media" } }),
    );
  },
  pendingComponent: () => (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
  component: DownloadsPage,
});

function DownloadsPage() {
  const search = Route.useSearch();
  const input = { ...search, type: "download_media" as const };

  const { data: stats } = useSuspenseQuery(
    orpc.job.stats.queryOptions({ input: { type: "download_media" } }),
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    orpc.job.list.infiniteOptions({
      initialPageParam: 1,
      input: (page) => ({ ...input, page, perPage: 30 }),
      getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    }),
  );

  const flatItems = data.pages.flatMap((page) => page.items);

  return (
    <Main>
      <style>{`
        @keyframes fade-slide-up {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-stagger-1 { animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
        .animate-stagger-2 { animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
        .animate-stagger-3 { animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
        .animate-stagger-4 { animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both; }
      `}</style>

      <header className="mb-8 animate-stagger-1">
        <h1 className="mb-4 text-4xl text-foreground md:text-5xl">Download Tasks.</h1>
        <p className="max-w-lg font-mono text-muted-foreground text-sm leading-relaxed">
          SYSTEM_STATUS / TRACKING {stats.total} JOBS OVER {stats.completed} COMPLETED.
        </p>
      </header>

      <div className="mb-10 animate-stagger-2">
        <StatsOverview stats={stats} />
      </div>

      <div className="mb-6 flex animate-stagger-3 items-center gap-6 border-muted/30 border-b pb-4">
        <Link
          to="/downloads"
          className="font-medium text-muted-foreground text-xs uppercase tracking-widest transition-colors hover:text-foreground aria-[current=page]:text-foreground"
        >
          All
        </Link>
        <Link
          to="/downloads"
          search={{ status: "pending" }}
          className="font-medium text-muted-foreground text-xs uppercase tracking-widest transition-colors hover:text-foreground aria-[current=page]:text-foreground"
        >
          Pending
        </Link>
        <Link
          to="/downloads"
          search={{ status: "processing" }}
          className="font-medium text-muted-foreground text-xs uppercase tracking-widest transition-colors hover:text-foreground aria-[current=page]:text-foreground"
        >
          Active
        </Link>
        <Link
          to="/downloads"
          search={{ status: "failed" }}
          className="relative font-medium text-muted-foreground text-xs uppercase tracking-widest transition-colors hover:text-foreground aria-[current=page]:text-foreground"
        >
          Failed
          {stats.failed > 0 && (
            <span className="absolute -top-1 -right-3 h-1.5 w-1.5 rounded-full bg-red-500" />
          )}
        </Link>
      </div>

      <div className="animate-stagger-4 space-y-4">
        <div className="grid grid-cols-12 gap-4 px-2 font-mono text-muted-foreground/60 text-xs tracking-wider">
          <div className="col-span-5 md:col-span-6">RESOURCE</div>
          <div className="col-span-3 text-right">METRICS</div>
          <div className="col-span-4 text-right md:col-span-3">STATUS</div>
        </div>

        {flatItems.length === 0 ? (
          <div className="py-24 text-center font-mono text-muted-foreground text-sm">
            [ NO_TASKS_FOUND_FOR_CURRENT_FILTER ]
          </div>
        ) : (
          flatItems.map((task) => <DownloadTaskItem key={task.id} task={task} />)
        )}

        {hasNextPage && (
          <div className="py-4 text-center">
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="font-mono text-muted-foreground text-xs uppercase tracking-widest transition-colors hover:text-foreground disabled:opacity-50"
            >
              {isFetchingNextPage ? "LOADING_MORE..." : "[ LOAD_MORE_RECORDS ]"}
            </button>
          </div>
        )}
      </div>
    </Main>
  );
}
