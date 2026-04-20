import type { BrowseItem } from "@workspace/contracts/file-manager";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { fSize } from "@/utils/format-number";
import { fDate } from "@/utils/format-time";
import { useItem } from "../../hooks/use-item";
import { ItemIcon } from "./icon";

interface FileListItemProps {
  item: BrowseItem;
  orderedIds: string[];
  index: number;
}

export function FileListItem({ item, orderedIds, index }: FileListItemProps) {
  const {
    isFocused,
    isSelected,
    isDragging,
    isOver,
    attributes,
    listeners,
    onClick,
    onDoubleClick,
    combinedRef,
  } = useItem(item, index);

  return (
    <div
      aria-hidden="true"
      ref={combinedRef}
      id={item.id}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-md p-2",
        "group transition-colors hover:bg-accent/50",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        isSelected && "bg-accent text-accent-foreground ring-2 ring-ring",
        isFocused && "ring-2 ring-ring/50",
        isDragging && "opacity-50",
        isOver && item.type === "folder" && "bg-primary/20 ring-2 ring-primary",
      )}
      // style={style}
      onClick={(e) => onClick(item.id, orderedIds, index, e)}
      onDoubleClick={() => onDoubleClick(item)}
      // role="row"
      aria-selected={isSelected}
      {...attributes}
      tabIndex={0}
      {...listeners}
    >
      {/* Selection checkbox */}
      <div
        className={cn(
          "opacity-0 transition-opacity",
          "group-hover:opacity-100",
          isSelected && "opacity-100",
        )}
      >
        <Checkbox checked={isSelected} className="pointer-events-none" />
      </div>

      {/* File icon */}
      <div className="shrink-0">
        <ItemIcon item={item} size="small" />
      </div>

      {/* File name */}
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium text-sm" title={item.name}>
          {item.name}
        </div>
      </div>

      {/* File size */}
      <div className="w-20 shrink-0 text-right">
        {item.type !== "folder" && item.size ? (
          <div className="text-muted-foreground text-xs">{fSize(item.size)}</div>
        ) : (
          <div className="text-muted-foreground text-xs">—</div>
        )}
      </div>

      {/* Modified date */}
      <div className="w-32 shrink-0 text-right">
        <div className="text-muted-foreground text-xs">{fDate(item.createdAt)}</div>
      </div>
    </div>
  );
}
