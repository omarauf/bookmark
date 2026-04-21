import { cn } from "@/lib/utils";
import { useDragToSelectContext } from "./context";

interface SelectionBoxProps {
  className?: string;
}

export function SelectionBox({ className }: SelectionBoxProps) {
  const dragSelect = useDragToSelectContext();

  const { isDragging, selectionRect } = dragSelect;

  if (!selectionRect || !isDragging) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute border-2 border-blue-500 bg-blue-500/20",
        className,
      )}
      style={{
        top: selectionRect.y,
        left: selectionRect.x,
        width: selectionRect.width,
        height: selectionRect.height,
      }}
    />
  );
}

SelectionBox.displayName = "DragToSelectSelectionBox";
