import type { BrowseItem } from "@workspace/contracts/file-manager";
import { useCallback, useEffect, useRef } from "react";
import { DragToSelect } from "@/components/drag-to-select";
import { useStore } from "../../store";

type Props = {
  items: BrowseItem[];
  children: React.ReactNode;
};

export function DragSelectionArea({ items, children }: Props) {
  const selectedItems = useStore((s) => s.selectedItems);
  const setSelectedItems = useStore((s) => s.setSelectedItems);
  const setSelectedItemsData = useStore((s) => s.setSelectedItemsData);

  const isDraggingRef = useRef(false);

  const onSelectionStart = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const onSelectionEnd = useCallback(() => {
    isDraggingRef.current = false;
    // enrich after drag ends
    setSelectedItemsData(items);
  }, [items, setSelectedItemsData]);

  // Enrich on click/keyboard selections and mutation re-sync
  // biome-ignore lint/correctness/useExhaustiveDependencies: skip during drag, enrich on drag end instead
  useEffect(() => {
    if (isDraggingRef.current) return;
    setSelectedItemsData(items);
  }, [selectedItems, items, setSelectedItemsData]);

  return (
    <DragToSelect.Root
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
      onSelectionStart={onSelectionStart}
      onSelectionEnd={onSelectionEnd}
    >
      <DragToSelect.ContainerScrollArea>{children}</DragToSelect.ContainerScrollArea>
    </DragToSelect.Root>
  );
}
