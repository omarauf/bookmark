import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { TiktokSchemas } from "@workspace/contracts/tiktok";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { EmptyContent } from "@/components/empty-content";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { cn } from "@/lib/utils";
import { PostDialog } from "@/modules/tiktok/components/dialog";
import { Filter } from "@/modules/tiktok/components/filter";
import { PostCard } from "@/modules/tiktok/components/post/card";

export const Route = createFileRoute("/_authenticated/tiktok/")({
  component: Tiktok,
  validateSearch: TiktokSchemas.list.request,
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { orpc, queryClient }, deps }) => {
    await queryClient.prefetchInfiniteQuery(
      orpc.post.list.infiniteOptions({
        initialPageParam: 1,
        input: (searchParams) => ({ ...deps, page: searchParams, limit: 30 }),
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
      }),
    );
    return;
  },
});

function Tiktok() {
  const search = Route.useSearch();
  const postQuery = useSuspenseInfiniteQuery(
    orpc.post.list.infiniteOptions({
      initialPageParam: 1,
      input: (searchParams) => ({ ...search, page: searchParams, limit: 30 }),
      getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    }),
  );

  const [selectedPostId, setSelectedPostId] = useState<string>();

  const flatItems = postQuery.data.pages.flatMap((page) => page.items);

  return (
    <Main className="py-0">
      <Filter className="sticky top-0 z-10 flex w-full bg-background" />

      <InfiniteScroll
        onLoadMore={postQuery.fetchNextPage}
        hasNextPage={postQuery.hasNextPage}
        isFetchingNextPage={postQuery.isFetchingNextPage}
      >
        <div className="grid 3xl:grid-cols-6 4xl:grid-cols-7 grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {flatItems.map((ig) => (
            <PostCard key={ig.id} post={ig} onClick={setSelectedPostId} />
          ))}
        </div>

        <div
          className={cn(
            "mt-4 flex w-full items-center justify-center",
            !postQuery.isFetchingNextPage && "hidden",
          )}
        >
          <LoaderIcon className="animate-spin" />
        </div>
      </InfiniteScroll>

      <EmptyContent show={!flatItems.length} />

      <PostDialog
        posts={flatItems}
        selectedPostId={selectedPostId}
        onPostChange={setSelectedPostId}
      />
    </Main>
  );
}
