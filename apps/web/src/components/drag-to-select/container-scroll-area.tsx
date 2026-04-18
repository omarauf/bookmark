import { Children, isValidElement, type ReactNode, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { useDragToSelectContext } from "./context";
import { SelectionBox } from "./selection-box";

interface ContainerProps {
  children?: ReactNode;
  className?: string;
}

export function ContainerScrollArea({ children, className }: ContainerProps) {
  const dragSelect = useDragToSelectContext();

  const { containerProps } = dragSelect;

  const hasSelectionBox = useMemo(() => {
    return Children.toArray(children).some((child) => {
      if (!isValidElement(child)) return false;
      return (child.type as { displayName?: string }).displayName === "DragToSelectSelectionBox";
    });
  }, [children]);

  return (
    <ScrollArea
      viewportProps={{
        ref: containerProps.ref,
        onPointerDown: containerProps.onPointerDown,
        onPointerMove: containerProps.onPointerMove,
        onPointerUp: containerProps.onPointerUp,
        onScroll: containerProps.onScroll,
        onKeyDown: containerProps.onKeyDown,
        className: cn("relative select-none focus:outline-none", className),
      }}
      className="flex min-h-0 w-fit min-w-0 grow flex-col"
    >
      {children}

      {!hasSelectionBox && <SelectionBox />}
    </ScrollArea>
  );
}
