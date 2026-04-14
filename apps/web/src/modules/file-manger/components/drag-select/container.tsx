import { useShallow } from "zustand/shallow";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "../../store";

interface DragSelectContainerProps {
  children: React.ReactNode;
}

export function DragSelectContainer({ children }: DragSelectContainerProps) {
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
    <ScrollArea
      viewportProps={{
        ref: containerRef,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onScroll,
        onKeyDown,
        onKeyUp,
        tabIndex: -1,
        className: "relative select-none focus:outline-none",
      }}
      className="flex min-h-0 min-w-0 grow flex-col"
    >
      {children}
    </ScrollArea>
  );
}
