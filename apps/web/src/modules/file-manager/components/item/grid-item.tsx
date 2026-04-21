import type { BrowseItem } from "@workspace/contracts/file-manager";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useItem } from "../../hooks/use-item";
import { ItemIcon } from "./icon";

interface FileGridItemProps {
  item: BrowseItem;
  orderedIds: string[];
  index: number;
}

export function FileGridItem({ item, orderedIds, index }: FileGridItemProps) {
  const {
    isFocused,
    isSelected,
    isDragging,
    isOver,
    attributes,
    listeners,
    isGlobalDragging,
    isCut,
    setFocusedIndex,
    onClick,
    onDoubleClick,
    combinedRef,
  } = useItem(item, index);

  return (
    <div
      ref={combinedRef}
      id={item.id}
      data-item={item.id}
      className={cn(
        "relative flex cursor-pointer flex-col items-center rounded-lg p-3",
        "group transition-colors hover:bg-accent/50",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        isSelected && "bg-accent text-accent-foreground ring-2 ring-ring",
        isFocused && "outline-none ring-2 ring-blue-500",
        (isDragging || (isGlobalDragging && isSelected)) && "opacity-50",
        isCut && "opacity-40",
        isOver && item.type === "folder" && "bg-primary/20 ring-2 ring-primary",
      )}
      onClick={(e) => onClick(item.id, orderedIds, index, e)}
      onDoubleClick={() => onDoubleClick(item)}
      aria-selected={isSelected}
      {...attributes}
      // tabIndex={0}
      {...listeners}
      onPointerDown={(e) => {
        e.stopPropagation();
        setFocusedIndex(index);
        listeners?.onPointerDown(e);
      }}
    >
      {/* Selection checkbox */}
      <div
        className={cn(
          "absolute top-2 left-2 opacity-0 transition-opacity",
          "group-hover:opacity-100",
          isSelected && "opacity-100",
        )}
      >
        <Checkbox checked={isSelected} className="pointer-events-none" />
      </div>

      {/* File icon */}
      <div className="mb-2">
        <ItemIcon item={item} />
      </div>

      {/* File name */}
      <div className="w-full text-center">
        <div className="truncate px-1 font-medium text-sm" title={item.name}>
          {index}. {item.name}
        </div>

        {/* {item.type === "file" && item.size && (
          <div className="mt-1 text-muted-foreground text-xs">{formatFileSize(item.size)}</div>
        )} */}
      </div>
    </div>
  );
}
