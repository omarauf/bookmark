import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderTree } from "../components/folder-tree";
import { LinkBreadcrumb } from "../components/link-breadcrumb";
import { Content } from "./content";

export function LinkBrowserView() {
  return (
    <div className="flex min-h-0">
      <FolderTree className="flex min-h-0 w-64 flex-col border-r" />

      <div className="flex flex-1 flex-col overflow-auto">
        <LinkBreadcrumb className="border-b px-4 py-3" />

        <ScrollArea className="flex-1 overflow-auto p-4">
          <Content />
        </ScrollArea>
      </div>
    </div>
  );
}
