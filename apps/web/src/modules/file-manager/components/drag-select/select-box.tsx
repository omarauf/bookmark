import { useShallow } from "zustand/shallow";
import { cn } from "@/lib/utils";
import { useStore } from "../../store";

export function SelectBox({ className }: { className?: string }) {
  const [dragVector, scrollVector, isDragging, containerRef] = useStore(
    useShallow((s) => [s.dragVector, s.scrollVector, s.isDragging, s.containerRef]),
  );

  const selectionRect =
    dragVector && scrollVector && isDragging && containerRef.current
      ? dragVector
          .add(scrollVector)
          .clamp(
            new DOMRect(0, 0, containerRef.current.scrollWidth, containerRef.current.scrollHeight),
          )
          .toDOMRect()
      : null;

  if (!selectionRect) return null;

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
