import clsx from "clsx";
import type { ReactNode } from "react";
import { useSelectedItemContext } from "./context";

interface ItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function Item({ id, children, className }: ItemProps) {
  const selectedItems = useSelectedItemContext();

  return (
    <div
      data-item={id}
      className={clsx(
        "flex size-10 select-none items-center justify-center border-2 border-black",
        selectedItems.has(id) ? "bg-white text-black" : "bg-black text-white",
        className,
      )}
    >
      {children}
    </div>
  );
}
