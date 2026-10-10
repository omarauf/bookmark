import type { StateCreator } from "zustand";
import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

type LayoutState = {
  layout: "D" | "E";
};

type LayoutActions = {
  toggleLayout: () => "D" | "E";
};

const initialState: LayoutState = {
  layout: "D",
};

const layoutStore: StateCreator<LayoutState & LayoutActions> = (set, get) => ({
  ...initialState,

  toggleLayout: () => {
    const { layout } = get();
    const newLayout = layout === "D" ? "E" : "D";
    set({ layout: newLayout });
    return newLayout;
  },
});

export const useLayoutStore = create<LayoutState & LayoutActions>()(
  subscribeWithSelector(persist(layoutStore, { name: "youtube-details-layout" })),
);
