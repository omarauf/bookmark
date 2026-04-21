import { DragOverlay } from "@dnd-kit/core";
import { File, Folder } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { cn } from "@/lib/utils";
import { useItems } from "../hooks/use-items";
import { useStore } from "../store";

export function DragPreview() {
  const { getItemData } = useItems();
  const [items, dropOperation] = useStore(useShallow((s) => [s.selectedItems, s.dropOperation]));
  if (items.size === 0) return null;

  const firstItem = Array.from(items)[0];
  const count = items.size;

  if (!firstItem) return null;

  const item = getItemData(firstItem);
  if (!item) return null;

  return (
    <DragOverlay className="cursor-grabbing">
      <div className="flex w-fit cursor-grabbing items-center gap-2 rounded-md border border-border bg-card p-2 shadow-lg">
        <div className="shrink-0">
          {item.type === "folder" ? (
            <Folder className="h-4 w-4 text-blue-500" />
          ) : (
            <File className="h-4 w-4 text-gray-500" />
          )}
        </div>

        <div className="w-fit min-w-0 flex-1">
          <div className="truncate font-medium text-sm">{item.name}</div>
          {count > 1 && (
            <div className="text-muted-foreground text-xs">
              +{count - 1} more item{count > 2 ? "s" : ""}
            </div>
          )}
        </div>

        {count > 1 && (
          <div className="shrink-0 rounded-full bg-primary px-2 py-1 text-primary-foreground text-xs">
            {count}
          </div>
        )}

        <div
          className={cn(
            "w-12 shrink-0 rounded-full py-1 text-center font-medium text-[10px] uppercase tracking-wide",
            dropOperation === "copy"
              ? "bg-emerald-500 text-white"
              : "bg-muted text-muted-foreground",
          )}
        >
          {dropOperation}
        </div>
      </div>
    </DragOverlay>
  );
}
