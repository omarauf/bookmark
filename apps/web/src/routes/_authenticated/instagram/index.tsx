import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PostSchemas } from "@workspace/contracts/post";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { orpc } from "@/integrations/orpc";
import { Header } from "@/layout/header";
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
          perPage: 65,
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
        perPage: 65,
        platform: "instagram",
      }),
      getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    }),
  );

  const flatItems = postQuery.data.pages.flatMap((page) => page.items);

  return (
    <div
      className="w-full overflow-hidden bg-yellow-900 pb-2"
      style={{
        display: "grid",
        gridTemplateAreas: `
      "top-bar top-bar top-bar"
      "tree    filter   filter"
      "tree    main     preview"
    `,
        gridTemplateRows: "auto auto 1fr", // last row takes remaining space
        gridTemplateColumns: "auto minmax(0, 1fr) auto",
      }}
    >
      {/* TOP BAR */}
      <Header className="[grid-area:top-bar]">
        <CollectionBreadcrumb />
      </Header>

      {/* TREE */}
      <CollectionTree className="rounded-xl [grid-area:tree]" />

      {/* FILTER */}
      <Filter className="sticky z-10 [grid-area:filter]" />

      {/* MAIN */}
      <InfiniteScroll
        onLoadMore={postQuery.fetchNextPage}
        hasNextPage={postQuery.hasNextPage}
        isFetchingNextPage={postQuery.isFetchingNextPage}
        isLoading={postQuery.isLoading}
        className="gap-4 bg-gray-800 px-4 [grid-area:main]"
      >
        <PostList posts={flatItems} />
      </InfiniteScroll>

      {/* PREVIEW */}
      <div className="w-20 [grid-area:preview]">Preview</div>
    </div>
  );
}
