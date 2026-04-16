import type { PanelSize } from "react-resizable-panels";
import type { StateCreator } from "zustand";
import type { StoreState } from "../type";

export type UISlice = {
  viewMode: "grid" | "list";
  columns: number;
  setColumns: (columns: number) => void;
  treeWidth: number;
  setTreeWidth: (
    panelSize: PanelSize,
    id: string | number | undefined,
    prevPanelSize: PanelSize | undefined,
  ) => void;
  handleViewModeToggle: () => void;
};

export const createUiSlice: StateCreator<StoreState, [], [], UISlice> = (set, get) => ({
  viewMode: "grid",
  columns: 1,
  treeWidth: Number.parseInt(localStorage.getItem("treeWidth") || "25", 10),

  setTreeWidth: ({ asPercentage }) => {
    set({ treeWidth: asPercentage });
    localStorage.setItem("treeWidth", asPercentage.toString());
  },

  handleViewModeToggle: () => {
    const { viewMode } = get();
    set({ viewMode: viewMode === "grid" ? "list" : "grid" });
  },

  setColumns: (columns) => set({ columns }),
});
