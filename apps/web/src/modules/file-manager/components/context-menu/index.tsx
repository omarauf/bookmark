import type React from "react";
import { useShallow } from "zustand/shallow";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useStore } from "../../store";
import { EmptyContextMenu } from "./menu-empty";
import { MultipleContextMenu } from "./menu-multiple";
import { SingleContextMenu } from "./menu-single";

interface FileContextMenuProps {
  children: React.ReactNode;
}

export function FileContextMenu({ children }: FileContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <MenuContent />
      </ContextMenuContent>
    </ContextMenu>
  );
}

function MenuContent() {
  const selectedItemIds = useStore(useShallow((s) => Array.from(s.selectedItems)));

  const itemCount = selectedItemIds.length;
  const isMultipleItems = itemCount > 1;
  const isSingleItem = itemCount === 1;
  const isEmpty = itemCount === 0;

  if (isEmpty) return <EmptyContextMenu />;
  if (isMultipleItems) return <MultipleContextMenu itemIds={selectedItemIds} />;
  if (isSingleItem) return <SingleContextMenu itemId={selectedItemIds[0]} />;
}
