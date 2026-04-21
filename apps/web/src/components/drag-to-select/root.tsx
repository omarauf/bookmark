import type { ReactNode } from "react";
import { DragToSelectProvider, SelectedItemProvider } from "./context";
import type { UseDragSelectOptions } from "./type";
import { useDragSelect } from "./use-drag-select";

interface RootProps extends UseDragSelectOptions {
  children?: ReactNode;
}

export function Root({ children, ...options }: RootProps) {
  const dragSelect = useDragSelect(options);

  return (
    <DragToSelectProvider value={dragSelect}>
      <SelectedItemProvider value={dragSelect.selectedItems}>{children}</SelectedItemProvider>
    </DragToSelectProvider>
  );
}
