import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSelectedItemContext } from "./context";

interface HeaderProps {
  className?: string;
  children?: ReactNode;
}

export function Header({ className, children }: HeaderProps) {
  const selectedItems = useSelectedItemContext();
  const count = selectedItems.size;

  return (
    <div className={cn("relative z-10 flex flex-row justify-between", className)}>
      <div className="border-2 border-foreground bg-background px-2">selectable area</div>
      {count > 0 && (
        <div className="border-2 border-foreground bg-background px-2">
          {children ?? `count: ${count}`}
        </div>
      )}
    </div>
  );
}
