import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import type { BrowseItem, File, Folder } from "@workspace/contracts/file-manager";
import { useRef } from "react";
import { orpc } from "@/integrations/orpc";
import { cn } from "@/lib/utils";
import { useFolderNavigation } from "../../hooks/use-folder-navigation";
import { useSyncGridColumns } from "../../hooks/use-sync-grid-columns";
import { useStore } from "../../store";
import { FileContextMenu } from "../context-menu";
import { DragSelectContainer } from "../drag-select/container";
import { SelectBox } from "../drag-select/select-box";
import { FileGridItem } from "../item/grid-item";
import { FileListItem } from "../item/list-item";
import { FolderBreadcrumb } from "./breadcrub";

export function FolderContent() {
  const viewMode = useStore((s) => s.viewMode);

  const folderId = useSearch({ from: "/_authenticated/file-manager/", select: (s) => s.folderId });
  const browseListQuery = useQuery(
    orpc.browse.list.queryOptions({ input: { parentId: folderId } }),
  );
  const items = mapToItem(browseListQuery.data?.folders, browseListQuery.data?.files);
  const orderedIds = items.map((item) => item.id);

  const gridRef = useRef<HTMLDivElement>(null);

  useSyncGridColumns(gridRef);
  useFolderNavigation(orderedIds);

  return (
    <div className="flex h-full flex-col overflow-auto">
      {/* Breadcrumb */}
      <div className="border-border border-b p-3">
        <FolderBreadcrumb />
      </div>

      {/* Content area */}
      <DragSelectContainer>
        <FileContextMenu>
          <div
            ref={gridRef}
            className={cn(
              "relative h-full p-4",
              viewMode === "grid"
                ? "grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] content-start gap-4"
                : "space-y-1",
            )}
          >
            {items.length === 0 && (
              <div className="col-span-full flex items-center justify-center py-12 text-muted-foreground">
                This folder is empty
              </div>
            )}
            {items.map((item, index) =>
              viewMode === "grid" ? (
                <FileGridItem key={item.id} item={item} orderedIds={orderedIds} index={index} />
              ) : (
                <FileListItem key={item.id} item={item} orderedIds={orderedIds} index={index} />
              ),
            )}
          </div>
        </FileContextMenu>
        <SelectBox />
      </DragSelectContainer>
    </div>
  );
}

function mapToItem(folders: Folder[] = [], files: File[] = []): BrowseItem[] {
  const folderItems: BrowseItem[] = folders.map((folder) => ({
    ...folder,
    type: "folder",
  }));

  return [...folderItems, ...files];
}
