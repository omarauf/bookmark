import { useSearch } from "@tanstack/react-router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderNavigator } from "../components/folder-navigator";
import { LinkBreadcrumb } from "../components/link-breadcrumb";
import { Content } from "./content";
import { SearchResults } from "./search-results";

export function LinkBrowserView() {
  const q = useSearch({ from: "/_authenticated/links/", select: (s) => s.q });
  const isSearching = !!q;

  if (isSearching) {
    return <SearchResults />;
  }

  return (
    <div className="flex min-h-0">
      <FolderNavigator className="flex min-h-0 w-64 flex-col border-r" />

      <div className="flex flex-1 flex-col overflow-auto">
        <LinkBreadcrumb className="border-b px-4 py-3" />

        <ScrollArea className="flex-1 overflow-auto p-4">
          <Content />
        </ScrollArea>
      </div>
    </div>
  );
}
