import type { PanelSize } from "react-resizable-panels";
import type { StateCreator } from "zustand";
import type { StoreState } from "../type";

export type UISlice = {
  viewMode: "grid" | "list";
  columns: number;
  treeWidth: number;
  setTreeWidth: (
    panelSize: PanelSize,
    id: string | number | undefined,
    prevPanelSize: PanelSize | undefined,
  ) => void;
  handleViewModeToggle: () => void;
  handleWindowResize: () => void;
};

export const createUiSlice: StateCreator<StoreState, [], [], UISlice> = (set, get) => ({
  viewMode: "grid",
  columns: -1,
  treeWidth: Number.parseInt(localStorage.getItem("treeWidth") || "25", 10),

  setTreeWidth: ({ asPercentage }) => {
    const { handleWindowResize } = get();
    set({ treeWidth: asPercentage });
    handleWindowResize();
    localStorage.setItem("treeWidth", asPercentage.toString());
  },

  handleViewModeToggle: () => {
    const { viewMode } = get();
    set({ viewMode: viewMode === "grid" ? "list" : "grid" });
  },

  handleWindowResize: () => {
    const { viewMode, containerRef } = get();
    if (viewMode !== "grid") return;
    if (!containerRef?.current) return;
    containerRef.current.focus(); // TODO: move this to init or useEffect hook
    const width = containerRef.current.offsetWidth - 32;
    const colWidth = 120 + 16;
    set({ columns: Math.max(1, Math.floor((width + 16) / colWidth)) });
  },
});
