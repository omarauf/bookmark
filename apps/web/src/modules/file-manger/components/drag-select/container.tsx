import { useShallow } from "zustand/shallow";
import { cn } from "@/lib/utils";
import { useStore } from "../../store";
import { Scrollbar } from "../scrollbar";

interface DragSelectContainerProps {
  children: React.ReactNode;
  className?: string;
  selectionRectClassName?: string;
}

export function DragSelectContainer({ children, className }: DragSelectContainerProps) {
  const [containerRef, onPointerDown, onPointerMove, onPointerUp, onScroll, onKeyDown, onKeyUp] =
    useStore(
      useShallow((s) => [
        s.containerRef,
        s.handlePointerDown,
        s.handlePointerMove,
        s.handlePointerUp,
        s.handleScroll,
        s.handleKeyDown,
        s.handleKeyUp,
      ]),
    );

  return (
    <Scrollbar
      scrollableNodeProps={{
        ref: containerRef,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onScroll,
        onKeyDown,
        onKeyUp,
        tabIndex: -1,
      }}
      className={cn("relative select-none focus:outline-none", className)}
      classNames={{ contentEl: "h-full" }}
    >
      {children}
    </Scrollbar>
  );
}
