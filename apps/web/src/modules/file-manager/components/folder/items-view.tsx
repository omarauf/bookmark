import type { BrowseItem } from "@workspace/contracts/file-manager";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useSyncGridColumns } from "../../hooks/use-sync-grid-columns";
import { useStore } from "../../store";
import { FileGridItem } from "../item/grid-item";
import { FileListItem } from "../item/list-item";

type Props = { items: BrowseItem[] };

export function ItemsView({ items }: Props) {
  const viewMode = useStore((s) => s.viewMode);
  const gridRef = useRef<HTMLDivElement>(null);
  useSyncGridColumns(gridRef);
  const orderedIds = items.map((item) => item.id);

  if (items.length === 0) {
    return (
      <div className="col-span-full flex items-center justify-center py-12 text-muted-foreground">
        This folder is empty
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className={cn(
        "relative h-full p-4",
        viewMode === "grid"
          ? "grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] content-start gap-4"
          : "space-y-1",
      )}
    >
      {items.map((item, index) =>
        viewMode === "grid" ? (
          <FileGridItem key={item.id} item={item} orderedIds={orderedIds} index={index} />
        ) : (
          <FileListItem key={item.id} item={item} orderedIds={orderedIds} index={index} />
        ),
      )}
    </div>
  );
}
