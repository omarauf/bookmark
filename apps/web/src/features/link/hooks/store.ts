import { create, type StateCreator } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type Store = {
  isGlobalDragging: boolean;
  isManualSelecting: boolean;

  setIsGlobalDragging: (dragging: boolean) => void;
  setIsManualSelecting: (selecting: boolean) => void;

  selectedIds: Set<string>;
  toggleSelection: (id: string) => void;
  setSelection: (ids: Set<string>) => void;
  isSelected: (id: string) => boolean;
  clearSelection: () => void;

  activeId?: string;
  setActiveId: (id?: string) => void;
};

const linkDragStore: StateCreator<Store> = (set, get) => ({
  isGlobalDragging: false,
  selectedIds: new Set<string>(),
  toggleSelection: (id: string) => {
    set((prev) => {
      const selected = prev.selectedIds.has(id);
      const newSelectedIds = new Set(prev.selectedIds);
      if (selected) newSelectedIds.delete(id);
      else newSelectedIds.add(id);
      return { selectedIds: newSelectedIds };
    });
  },

  isSelected: (id: string) => get().selectedIds.has(id),

  setSelection: (ids: Set<string>) => set({ selectedIds: ids }),

  setIsGlobalDragging: (dragging: boolean) => set({ isGlobalDragging: dragging }),

  clearSelection: () => set({ selectedIds: new Set<string>() }),

  setIsManualSelecting: (selecting: boolean) => set({ isManualSelecting: selecting }),
  isManualSelecting: false,
  activeId: undefined,
  setActiveId: (id?: string) => set({ activeId: id }),
});

export const useLinkDragStore = create<Store>()(subscribeWithSelector(linkDragStore));
