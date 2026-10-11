import { useShallow } from "zustand/react/shallow";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Main } from "@/layout/main";
import { CollectionTree } from "@/modules/collections/components/tree";
import { useLayoutStore } from "./controls/layout-store";
import { PostFeed } from "./feed";
import { Filter } from "./filter";
import { PostPreview } from "./preview";

export function Posts() {
  const layout = useLayoutStore(useShallow((state) => state.layout));
  const setLayout = useLayoutStore(useShallow((state) => state.setLayout));
  const ref = useLayoutStore(useShallow((state) => state.ref));

  return (
    <Main
      layout="fixed"
      island
      className="h-full w-full gap-1 overflow-hidden rounded-none bg-sidebar px-0"
      breadcrumbs={[{ label: "Instagram" }]}
    >
      <Filter className="rounded-xl bg-background" />

      <ResizablePanelGroup
        orientation="horizontal"
        className="flex h-full min-h-0 gap-1"
        defaultLayout={layout}
        groupRef={ref}
        onLayoutChanged={setLayout}
      >
        <ResizablePanel id="tree" className="shrink-0" collapsible minSize={200} maxSize="25%">
          <CollectionTree className="h-full rounded-xl" />
        </ResizablePanel>

        {/*<ResizableHandle />*/}

        <ResizablePanel
          id="main"
          // defaultSize="50%"
          className="flex grow flex-col overflow-auto rounded-xl bg-background"
        >
          <PostFeed className="p-4" />
        </ResizablePanel>

        {/*<ResizableHandle className="transition-colors hover:bg-primary" />*/}

        <ResizablePanel
          collapsible
          minSize={100}
          id="preview"
          // defaultSize="30%"
          className="w-40 shrink-0 rounded-xl bg-background"
        >
          <PostPreview />
        </ResizablePanel>
      </ResizablePanelGroup>
    </Main>
  );
}
