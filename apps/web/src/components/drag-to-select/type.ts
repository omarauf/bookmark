export type ContainerProps = {
  ref: React.RefObject<HTMLDivElement | null>;
  tabIndex: number;
  disabled?: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

export interface UseDragSelectOptions {
  selectedItems?: Set<string>;
  setSelectedItems?: (selectedItems: Set<string>) => void;
  itemSelector?: string;
  itemDataAttribute?: string;
  dragThreshold?: number;
  autoScrollThreshold?: number;
  autoScrollSpeed?: number;
  disabled?: boolean;
  onSelectionStart?: () => void;
  onSelectionEnd?: () => void;
}

export interface UseDragSelectReturn {
  selectedItems: Set<string>;
  isDragging: boolean;
  selectionRect: DOMRect | null;
  clearSelection: () => void;
  containerProps: ContainerProps;
}
