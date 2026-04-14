import { File, Folder } from "lucide-react";
import { useStore } from "../store";

export function DragPreview() {
  const items = useStore((s) => s.draggedItems);
  if (items.length === 0) return null;

  const firstItem = items[0];
  const count = items.length;

  if (!firstItem) return null;

  return (
    <div className="flex cursor-grabbing items-center gap-2 rounded-md border border-border bg-card p-2 shadow-lg">
      <div className="shrink-0">
        {firstItem.type === "folder" ? (
          <Folder className="h-4 w-4 text-blue-500" />
        ) : (
          <File className="h-4 w-4 text-gray-500" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate font-medium text-sm">{firstItem.name}</div>
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
    </div>
  );
}
