import { useDroppable } from "@dnd-kit/core";
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";
import type React from "react";
import { useCallback } from "react";
import { useShallow } from "zustand/shallow";
import { cn } from "@/lib/utils";
import { useStore } from "../../store";
import type { FileItem } from "../../types";

interface TreeNodeProps {
  item: FileItem;
  level: number;
  isSelected: boolean;
  isExpanded: boolean;
}

export function TreeNode({ item, level, isSelected, isExpanded }: TreeNodeProps) {
  const [currentFolderId, onToggleExpanded, onSelect] = useStore(
    useShallow((s) => [s.currentFolderId, s.handleToggleExpanded, s.handleFolderChange]),
  );

  const hasChildren = item.type === "folder" && item.children && item.children.length > 0;
  const paddingLeft = level * 16 + 8;

  const { setNodeRef, isOver } = useDroppable({
    id: item.id,
    disabled: item.type !== "folder",
  });

  const handleClick = useCallback(() => {
    if (item.type === "folder") onSelect(item.id);
  }, [item.id, item.type, onSelect]);

  const handleToggleExpanded = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasChildren) {
        onToggleExpanded(item.id);
      }
    },
    [hasChildren, item.id, onToggleExpanded],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      } else if (e.key === "ArrowRight" && hasChildren && !isExpanded) {
        e.preventDefault();
        onToggleExpanded(item.id);
      } else if (e.key === "ArrowLeft" && hasChildren && isExpanded) {
        e.preventDefault();
        onToggleExpanded(item.id);
      }
    },
    [handleClick, hasChildren, isExpanded, item.id, onToggleExpanded],
  );

  if (item.type !== "folder") return null;

  return (
    <div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex h-8 cursor-pointer items-center rounded-sm transition-colors hover:bg-accent/50",
          "focus:bg-accent focus:outline-none focus:ring-1 focus:ring-ring",
          isSelected && "bg-accent text-accent-foreground",
          isOver && "bg-primary/20 ring-2 ring-primary",
        )}
        style={{ paddingLeft }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
      >
        <button
          className={cn(
            "mr-1 flex h-4 w-4 items-center justify-center rounded-sm",
            "transition-colors hover:bg-muted",
            !hasChildren && "invisible",
          )}
          onClick={handleToggleExpanded}
          tabIndex={-1}
          aria-hidden={!hasChildren}
        >
          {hasChildren &&
            (isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            ))}
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-blue-500" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-blue-500" />
          )}
          <span className="truncate text-sm" title={item.name}>
            {item.name}
          </span>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div role="group">
          {item.children?.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              isSelected={child.id === currentFolderId}
              isExpanded={isExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}
