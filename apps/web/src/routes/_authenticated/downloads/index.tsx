import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { JobSchemas } from "@workspace/contracts/job";
import { InfiniteScroll } from "@/components/infinite-scroll";
import Loader from "@/components/loader";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { StatsOverview } from "@/modules/download-task/stats-overview";
import { DownloadTaskItem } from "@/modules/download-task/task-item";

export const Route = createFileRoute("/_authenticated/downloads/")({
  validateSearch: JobSchemas.list.request,
  pendingComponent: () => <Loader className="h-screen w-screen" />,
  component: DownloadsPage,
});

function DownloadsPage() {
  const search = Route.useSearch();
  const input = { ...search };

  const { data: stats } = useSuspenseQuery(
    orpc.job.stats.queryOptions({ input: { types: ["download_media", "youtube_download"] } }),
  );

  const query = useSuspenseInfiniteQuery(
    orpc.job.list.infiniteOptions({
      initialPageParam: 1,
      input: (page) => ({
        ...input,
        types: ["download_media", "youtube_download"],
        page,
        perPage: 30,
      }),
      getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    }),
  );

  const flatItems = query.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <Main className="flex h-full flex-col pb-0">
      <style>{`
        @keyframes fade-slide-up {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-stagger-1 { animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
        .animate-stagger-2 { animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
        .animate-stagger-3 { animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
        .animate-stagger-4 { animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both; }
        .animate-stagger-5 { animation: fade-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both; }
      `}</style>

      <header className="mb-8 animate-stagger-1">
        <h1 className="mb-4 text-4xl text-foreground md:text-5xl">Download Tasks.</h1>
        <p className="max-w-lg text-muted-foreground text-sm leading-relaxed">
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

      <div className="animate-stagger-4 space-y-4 pb-4">
        <div className="grid grid-cols-12 gap-4 px-2 text-muted-foreground/60 text-xs tracking-wider">
          <div className="col-span-5 md:col-span-6">RESOURCE</div>
          <div className="col-span-3 text-right">METRICS</div>
          <div className="col-span-4 text-right md:col-span-3">STATUS</div>
        </div>
      </div>

      <div className="flex h-full min-h-0 animate-stagger-5">
        <InfiniteScroll
          onLoadMore={query.fetchNextPage}
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          isLoading={query.isLoading}
          className="pb-4"
        >
          {flatItems.map((task) => (
            <DownloadTaskItem key={task.id} task={task} />
          ))}
        </InfiniteScroll>
      </div>
    </Main>
  );
}
