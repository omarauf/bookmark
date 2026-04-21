import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PostSchemas } from "@workspace/contracts/post";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { orpc } from "@/integrations/orpc";
import { Header } from "@/layout/header";
import { CollectionBreadcrumb } from "@/modules/item/collection-breadcrumb";
import { CollectionTree } from "@/modules/item/collection-tree";
// import { PostListVirtual } from "@/modules/post/archive/virtual";
import { Filter } from "@/modules/post/filter";

export const Route = createFileRoute("/_authenticated/instagram/virtual")({
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

  const _flatItems = postQuery.data.pages.flatMap((page) => page.items);

  return (
    <div
      className="h-full w-full gap-1 overflow-hidden bg-sidebar"
      style={{ display: "grid", gridTemplateRows: "auto 1fr" }}
    >
      {/* TOP BAR */}
      <Header className="rounded-sm bg-background px-4">
        <CollectionBreadcrumb />
      </Header>

      <ResizablePanelGroup orientation="horizontal" className="flex h-full min-h-0 gap-1">
        <ResizablePanel defaultSize="20%" className="shrink-0">
          <CollectionTree className="h-full rounded-sm" />
        </ResizablePanel>

        {/*<ResizableHandle />*/}

        <ResizablePanel
          defaultSize="80%"
          className="flex grow flex-col overflow-auto rounded-sm bg-background"
        >
          {/* FILTER */}
          <Filter className="sticky" />

          {/* MAIN */}
          <InfiniteScroll
            onLoadMore={postQuery.fetchNextPage}
            hasNextPage={postQuery.hasNextPage}
            isFetchingNextPage={postQuery.isFetchingNextPage}
            isLoading={postQuery.isLoading}
            className="gap-4 px-4"
          >
            {/* <PostListVirtual posts={flatItems} /> */}
          </InfiniteScroll>
        </ResizablePanel>

        {/*<ResizableHandle className="transition-colors hover:bg-primary" />*/}

        {/* PREVIEW */}
        {/*<ResizablePanel
          collapsible
          minSize={100}
          defaultSize="30%"
          className="w-40 shrink-0 rounded-sm bg-background"
        >
          <div className="p-2">Preview</div>
        </ResizablePanel>*/}
      </ResizablePanelGroup>
    </div>
  );
}
