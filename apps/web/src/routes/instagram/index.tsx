import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ListInstagramPostSchema } from "@workspace/contracts/instagram/post";
import { useState } from "react";
import { orpc } from "@/api/rpc";
import { EmptyContent } from "@/components/empty-content";
import { Iconify } from "@/components/iconify";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { PostDialog } from "@/features/instagram/components/dialog";
import { Filter } from "@/features/instagram/components/filter";
import { PostCard } from "@/features/instagram/components/post/card";
import { Main } from "@/layouts/containers/main";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/instagram/")({
  component: Instagram,
  validateSearch: ListInstagramPostSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { orpc, queryClient }, deps }) => {
    await queryClient.prefetchInfiniteQuery(
      orpc.instagramPosts.list.infiniteOptions({
        initialPageParam: 1,
        input: (searchParams) => ({ ...deps, page: searchParams, limit: 30 }),
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
      }),
    );
    return;
  },
});

function Instagram() {
  const search = Route.useSearch();
  const postQuery = useSuspenseInfiniteQuery(
    orpc.instagramPosts.list.infiniteOptions({
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
            <PostCard key={ig.postId} post={ig} onClick={setSelectedPostId} />
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

      <PostDialog
        posts={flatItems}
        selectedPostId={selectedPostId}
        onPostChange={setSelectedPostId}
      />
    </Main>
  );
}
