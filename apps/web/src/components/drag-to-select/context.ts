import { createContext, useContext } from "react";
import type { UseDragSelectReturn } from "./type";

const SelectedItemContext = createContext<Set<string>>(new Set());

const DragToSelectContext = createContext<UseDragSelectReturn | null>(null);

export const DragToSelectProvider = DragToSelectContext.Provider;

export const SelectedItemProvider = SelectedItemContext.Provider;

export function useDragToSelectContext() {
  const context = useContext(DragToSelectContext);
  if (context == null) {
    throw new Error("useDragToSelectContext must be used within a DragToSelect.Root");
  }
  return context;
}

export function useSelectedItemContext() {
  const context = useContext(SelectedItemContext);
  if (context == null) {
    throw new Error("useSelectedItemContext must be used within a DragToSelect.Root");
  }
  return context;
}
