import { cn } from "@/lib/utils";
import type { ContainerProps } from "./type";

interface DragSelectContainerProps {
  children: React.ReactNode;
  className?: string;
  selectionRect?: DOMRect | null;
  selectionRectClassName?: string;
  containerProps?: ContainerProps;
}

export function DragSelectContainer({
  children,
  className,
  selectionRect,
  selectionRectClassName,
  containerProps,
}: DragSelectContainerProps) {
  return (
    <div
      {...containerProps}
      className={cn(
        "relative select-none focus:outline-none",
        // "grid grid-cols-[repeat(20,min-content)] p-4 gap-4 border-2 border-white focus:border-dashed focus:outline-none overflow-auto" ,
        // "relative z-10",
        className,
      )}
    >
      {children}
      {selectionRect && !containerProps?.disabled && (
        <div
          className={cn(
            "pointer-events-none absolute border-2 border-blue-500 bg-blue-500/20",
            selectionRectClassName,
          )}
          style={{
            top: selectionRect.y,
            left: selectionRect.x,
            width: selectionRect.width,
            height: selectionRect.height,
          }}
        />
      )}
    </div>
  );
}
