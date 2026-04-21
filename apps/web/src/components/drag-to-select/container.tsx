import { Children, isValidElement, type ReactNode, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useDragToSelectContext } from "./context";
import { SelectionBox } from "./selection-box";

interface ContainerProps {
  children?: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  const dragSelect = useDragToSelectContext();

  const { containerProps } = dragSelect;

  const hasSelectionBox = useMemo(() => {
    return Children.toArray(children).some((child) => {
      if (!isValidElement(child)) return false;
      return (child.type as { displayName?: string }).displayName === "DragToSelectSelectionBox";
    });
  }, [children]);

  return (
    <div {...containerProps} className={cn("relative select-none focus:outline-none", className)}>
      {children}
      {/* Auto-inject if not provided */}
      {!hasSelectionBox && <SelectionBox />}
    </div>
  );
}
