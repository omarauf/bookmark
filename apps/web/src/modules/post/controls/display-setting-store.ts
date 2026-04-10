import type { StateCreator } from "zustand";
import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

type LayoutMode = "grid" | "list";
type CardSize = "S" | "M" | "L";
type AspectRatio = "landscape" | "square" | "portrait";
type ThumbnailScale = "fit" | "fill";

type DisplaySettingsState = {
  layout: LayoutMode;
  cardSize: CardSize;
  aspectRatio: AspectRatio;
  thumbnailScale: ThumbnailScale;
  showCardInfo: boolean;
  titleLines: number; // Assuming the dropdown is for number of lines (e.g., 1, 2, 3)
  flattenFolders: boolean;
};

type DisplaySettingsActions = {
  setLayout: (layout: LayoutMode) => void;
  setCardSize: (size: CardSize) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setThumbnailScale: (scale: ThumbnailScale) => void;
  toggleCardInfo: () => void;
  setTitleLines: (lines: number) => void;
  toggleFlattenFolders: () => void;
  resetToDefaults: () => void;
  setState: (state: Partial<DisplaySettingsState>) => void;
};

const initialState: DisplaySettingsState = {
  layout: "grid",
  cardSize: "M",
  aspectRatio: "square",
  thumbnailScale: "fit",
  showCardInfo: true,
  titleLines: 1,
  flattenFolders: false,
};

const displaySettingsStore: StateCreator<DisplaySettingsState & DisplaySettingsActions> = (
  set,
) => ({
  ...initialState,

  // Action implementations
  setLayout: (layout) => set({ layout }),
  setCardSize: (cardSize) => set({ cardSize }),
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  setThumbnailScale: (thumbnailScale) => set({ thumbnailScale }),

  // Toggle actions for booleans are usually cleaner
  toggleCardInfo: () => set((state) => ({ showCardInfo: !state.showCardInfo })),
  setTitleLines: (titleLines) => set({ titleLines }),
  toggleFlattenFolders: () => set((state) => ({ flattenFolders: !state.flattenFolders })),

  setState: (state) => set(state),

  // Utility to reset everything
  resetToDefaults: () => set(initialState),
});

export const useDisplaySettingsStore = create<DisplaySettingsState & DisplaySettingsActions>()(
  subscribeWithSelector(persist(displaySettingsStore, { name: "display-settings" })),
);
