import { cn } from "@/lib/utils";

type MainProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>;
};

export function Main({ className, children, ...props }: MainProps) {
  return (
    <main
      className={cn(
        "p-6",
        // If layout is fixed, make the main container flex and grow
        // fixed && "flex grow flex-col overflow-hidden",
        // If layout is not fluid, set the max-width
        // !fluid ? "@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl" : "px-4",
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}
