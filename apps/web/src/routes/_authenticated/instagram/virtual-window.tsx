import { createFileRoute } from "@tanstack/react-router";
import { PostSchemas } from "@workspace/contracts/post";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Header } from "@/layout/header";
import { CollectionBreadcrumb } from "@/modules/item/collection-breadcrumb";
import { CollectionTree } from "@/modules/item/collection-tree";
// import { PostListVirtualWindow } from "@/modules/post/archive/virtual-window";
import { Filter } from "@/modules/post/filter";

export const Route = createFileRoute("/_authenticated/instagram/virtual-window")({
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
  return (
    <div
      className="h-full w-full gap-1 overflow-hidden bg-sidebar"
      style={{ display: "grid", gridTemplateRows: "auto 1fr" }}
    >
      {/* TOP BAR */}
      <Header className="rounded-sm bg-background">
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
          {/* <PostListVirtualWindow /> */}
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
