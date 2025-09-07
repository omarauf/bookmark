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
