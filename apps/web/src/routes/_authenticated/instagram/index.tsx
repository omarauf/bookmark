import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PostSchemas } from "@workspace/contracts/post";
import { EmptyContent } from "@/components/empty-content";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { orpc } from "@/integrations/orpc";
import { Header } from "@/layout/header";
import { Main } from "@/layout/main";
import { CollectionBreadcrumb } from "@/modules/item/collection-breadcrumb";
import { CollectionTree } from "@/modules/item/collection-tree";
import { Filter } from "@/modules/post/filter";
import { PostList } from "@/modules/post/list";

export const Route = createFileRoute("/_authenticated/instagram/")({
  component: Instagram,
  validateSearch: PostSchemas.list.request,
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { orpc, queryClient }, deps }) => {
    await queryClient.prefetchInfiniteQuery(
      orpc.post.list.infiniteOptions({
        initialPageParam: 1,
        input: (searchParams) => ({
          ...deps,
          page: searchParams,
          limit: 30,
          platform: "instagram",
        }),
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
      }),
    );
    return;
  },
});

function Instagram() {
  const search = Route.useSearch();
  const postQuery = useSuspenseInfiniteQuery(
    orpc.post.list.infiniteOptions({
      initialPageParam: 1,
      input: (searchParams) => ({
        ...search,
        page: searchParams,
        limit: 30,
        platform: "instagram",
      }),
      getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    }),
  );

  const flatItems = postQuery.data.pages.flatMap((page) => page.items);

  return (
    <Main className="bg-temp py-0" fluid>
      <Header>
        <CollectionBreadcrumb />
      </Header>

      <div className="flex w-full gap-6 py-4">
        <CollectionTree className="shrink-0 rounded-xl" />

        <div className="flex w-full flex-col">
          <Filter className="sticky z-10 flex w-full" />

          <InfiniteScroll
            onLoadMore={postQuery.fetchNextPage}
            hasNextPage={postQuery.hasNextPage}
            isFetchingNextPage={postQuery.isFetchingNextPage}
          >
            <PostList posts={flatItems} />
          </InfiniteScroll>
        </div>
      </div>

      <EmptyContent show={!flatItems.length} />
    </Main>
  );
}
