import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { cn } from "@/lib/utils";
import { useStore } from "../../store";
import { findItemById } from "../../utils/file-utils";
import { FileContextMenu } from "../context-menu";
import { DragSelectContainer } from "../drag-select/container";
import { SelectBox } from "../drag-select/select-box";
import { FileGridItem } from "../item/grid-item";
import { FileListItem } from "../item/list-item";
import { FolderBreadcrumb } from "./breadcrub";

export function FolderContent() {
  const [tree, currentFolderId, viewMode, handleWindowResize, handleKeyNavigation] = useStore(
    useShallow((s) => [
      s.fileTree,
      s.currentFolderId,
      s.viewMode,
      s.handleWindowResize,
      s.handleKeyNavigation,
    ]),
  );

  // Get current folder and its contents
  const currentFolder = findItemById(tree, currentFolderId);
  const items = currentFolder?.children || [];

  useEffect(() => {
    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);
    document.addEventListener("keydown", handleKeyNavigation);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
      document.removeEventListener("keydown", handleKeyNavigation);
    };
  }, [handleKeyNavigation, handleWindowResize]);

  if (!currentFolder) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Folder not found
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-auto">
      {/* Breadcrumb */}
      <div className="border-border border-b p-3">
        <FolderBreadcrumb />
      </div>

      {/* Content area */}
      <DragSelectContainer>
        <FileContextMenu>
          <div
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
            {/* {items.map((item, index) => (
              <FileContextMenu key={item.id} item={item}>
                {viewMode === "grid" ? (
                  <FileGridItem item={item} index={index} />
                ) : (
                  <FileListItem item={item} index={index} />
                )}
              </FileContextMenu>
            ))} */}
            {items.map((item, index) =>
              viewMode === "grid" ? (
                <FileGridItem key={item.id} item={item} index={index} />
              ) : (
                <FileListItem key={item.id} item={item} index={index} />
              ),
            )}
          </div>
        </FileContextMenu>
        <SelectBox />
      </DragSelectContainer>
    </div>
  );
}
