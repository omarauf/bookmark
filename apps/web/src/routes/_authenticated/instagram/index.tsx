import { createFileRoute } from "@tanstack/react-router";
import { PostSchemas } from "@workspace/contracts/post";
import { useShallow } from "zustand/react/shallow";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Header } from "@/layout/header";
import { CollectionBreadcrumb } from "@/modules/item/collection-breadcrumb";
import { CollectionTree } from "@/modules/item/collection-tree";
import { useLayoutStore } from "@/modules/post/controls/layout-store";
import { Filter } from "@/modules/post/filter";
import { PostList } from "@/modules/post/list";

export const Route = createFileRoute("/_authenticated/instagram/")({
  component: Instagram,
  validateSearch: PostSchemas.list.request,
});

function Instagram() {
  const layout = useLayoutStore(useShallow((state) => state.layout));
  const setLayout = useLayoutStore(useShallow((state) => state.setLayout));
  const ref = useLayoutStore(useShallow((state) => state.ref));

  return (
    <div
      className="h-full w-full gap-1 overflow-hidden bg-sidebar"
      style={{ display: "grid", gridTemplateRows: "auto 1fr" }}
    >
      {/* TOP BAR */}
      <Header className="rounded-sm bg-background px-4">
        <CollectionBreadcrumb />
      </Header>

      <ResizablePanelGroup
        orientation="horizontal"
        className="flex h-full min-h-0 gap-1"
        defaultLayout={layout}
        groupRef={ref}
        onLayoutChanged={setLayout}
      >
        <ResizablePanel id="tree" className="shrink-0" collapsible minSize={200} maxSize="25%">
          <CollectionTree className="h-full rounded-sm" />
        </ResizablePanel>

        {/*<ResizableHandle />*/}

        <ResizablePanel
          id="main"
          // defaultSize="50%"
          className="flex grow flex-col overflow-auto rounded-sm bg-background"
        >
          {/* FILTER */}
          <Filter className="sticky" />

          {/* MAIN */}
          <PostList />
        </ResizablePanel>

        {/*<ResizableHandle className="transition-colors hover:bg-primary" />*/}

        <ResizablePanel
          collapsible
          minSize={100}
          id="preview"
          // defaultSize="30%"
          className="w-40 shrink-0 rounded-sm bg-background"
        >
          <div className="p-2">Preview</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
