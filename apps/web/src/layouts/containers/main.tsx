import { cn } from "@workspace/ui/lib/utils";
import type React from "react";

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  center?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const mainCenter = cn("container mx-auto mb-0 max-w-6xl");

export const Main = ({ fixed, center, className, ...props }: MainProps) => {
  return (
    <main
      className={cn(
        "peer-[.header-fixed]/header:mt-16",
        "px-4 py-8",
        fixed && "fixed-main flex grow flex-col overflow-hidden",
        center && mainCenter,
        className,
      )}
      {...props}
    />
  );
};

Main.displayName = "Main";
