import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PostSchemas } from "@workspace/contracts/post";
import { LoaderIcon } from "lucide-react";
import { EmptyContent } from "@/components/empty-content";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { orpc } from "@/integrations/orpc";
import { Main } from "@/layout/main";
import { cn } from "@/lib/utils";
import { TwitterCard } from "@/modules/twitter/card";

export const Route = createFileRoute("/_authenticated/twitter/")({
  component: Twitter,
  validateSearch: PostSchemas.list.request,
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

function Twitter() {
  const search = Route.useSearch();
  const postQuery = useSuspenseInfiniteQuery(
    orpc.post.list.infiniteOptions({
      initialPageParam: 1,
      input: (searchParams) => ({ ...search, page: searchParams, limit: 30 }),
      getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    }),
  );

  const flatItems = postQuery.data.pages.flatMap((page) => page.items);

  // return (
  //   <div className="mt-10 flex w-full flex-col items-center gap-8">
  //     {aaa.data.map((t) => (
  //       <TwitterCard key={t.postId} post={t} />
  //     ))}
  //   </div>
  // );

  return (
    <Main className="py-0">
      <InfiniteScroll
        onLoadMore={postQuery.fetchNextPage}
        hasNextPage={postQuery.hasNextPage}
        isFetchingNextPage={postQuery.isFetchingNextPage}
      >
        {/* <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"> */}
        <div className="mt-10 flex w-full flex-col items-center gap-8">
          {flatItems.map((t) => (
            <TwitterCard key={t.id} post={t} />
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
    </Main>
  );
}
