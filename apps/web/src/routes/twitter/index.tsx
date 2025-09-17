import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ListTwitterPostSchema } from "@workspace/contracts/twitter/post";
import { orpc } from "@/api/rpc";
import { EmptyContent } from "@/components/empty-content";
import { Iconify } from "@/components/iconify";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { TwitterCard } from "@/features/twitter/card";
import { Main } from "@/layouts/containers/main";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/twitter/")({
  component: Twitter,
  validateSearch: ListTwitterPostSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { orpc, queryClient }, deps }) => {
    await queryClient.prefetchInfiniteQuery(
      orpc.twitterPosts.list.infiniteOptions({
        initialPageParam: 1,
        input: (searchParams) => ({ ...deps, page: searchParams, limit: 30 }),
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
      }),
    );
    await queryClient.prefetchQuery(orpc.twitterPosts.test.queryOptions());
    return;
  },
});

function Twitter() {
  const search = Route.useSearch();
  const postQuery = useSuspenseInfiniteQuery(
    orpc.twitterPosts.list.infiniteOptions({
      initialPageParam: 1,
      input: (searchParams) => ({ ...search, page: searchParams, limit: 30 }),
      getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    }),
  );

  const aaa = useSuspenseQuery(orpc.twitterPosts.test.queryOptions({}));

  console.log("aaa", aaa.data);

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
            <TwitterCard key={t.postId} post={t} />
          ))}
        </div>

        <div
          className={cn(
            "mt-4 flex w-full items-center justify-center",
            !postQuery.isFetchingNextPage && "hidden",
          )}
        >
          <Iconify icon="svg-spinners:180-ring" width={200} />
        </div>
      </InfiniteScroll>

      <EmptyContent show={!flatItems.length} />
    </Main>
  );
}
