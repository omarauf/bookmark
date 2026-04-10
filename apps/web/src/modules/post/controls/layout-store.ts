import { createRef } from "react";
import type { GroupImperativeHandle, Layout } from "react-resizable-panels";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

type LayoutState = {
  layout: {
    tree: number;
    main: number;
    preview: number;
  };
  lastTree: number;
  lastPreview: number;
  ref: React.RefObject<GroupImperativeHandle | null>;
};

type LayoutActions = {
  getToggleValue: () => string[];
  handleToggleChange: (value: string[]) => void;
  setLayout: (layout: Layout) => void;
  isPreviewVisible: () => boolean;
};

const initialState: LayoutState = {
  layout: {
    tree: 20,
    main: 50,
    preview: 30,
  },
  lastTree: 20,
  lastPreview: 30,
  ref: createRef<GroupImperativeHandle | null>(),
};

const layoutStore: StateCreator<LayoutState & LayoutActions> = (set, get) => ({
  ...initialState,

  getToggleValue: () => {
    const { layout } = get();
    const { tree, preview } = layout;
    const result: string[] = [];

    if (tree > 0) result.push("tree");
    if (preview > 0) result.push("preview");

    return result;
  },

  handleToggleChange: (value: string[]) => {
    const { layout, lastTree, lastPreview, ref } = get();
    const { tree, preview } = layout;

    const hasTree = value.includes("tree");
    const hasPreview = value.includes("preview");

    let newTree = tree;
    let newPreview = preview;

    // --- TREE ---
    if (!hasTree && tree > 0) {
      // store before hiding
      set({ lastTree: tree });
      newTree = 0;
    } else if (hasTree && tree === 0) {
      // restore
      newTree = lastTree;
    }

    // --- PREVIEW ---
    if (!hasPreview && preview > 0) {
      set({ lastPreview: preview });
      newPreview = 0;
    } else if (hasPreview && preview === 0) {
      newPreview = lastPreview;
    }

    const newLayout = {
      tree: newTree,
      main: 100 - (newTree + newPreview),
      preview: newPreview,
    };
    ref.current?.setLayout(newLayout);
    set({ layout: newLayout });
  },

  setLayout: (layout) => {
    set({ layout: layout as LayoutState["layout"] });
  },

  isPreviewVisible: () => {
    const { layout } = get();
    return layout.preview > 0;
  },
});

export const useLayoutStore = create<LayoutState & LayoutActions>()(
  subscribeWithSelector(persist(layoutStore, { name: "layout" })),
);
