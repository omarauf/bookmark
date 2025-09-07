import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Iconify } from "@/components/iconify";
import { useSearch } from "./context";

interface Props {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
}

export function SearchButton({ className = "", placeholder = "Search" }: Props) {
  const { setOpen } = useSearch();
  return (
    <Button
      variant="outline"
      className={cn(
        "relative h-8 w-full flex-1 justify-start rounded-md bg-muted/25 font-normal text-muted-foreground text-sm shadow-none hover:bg-muted/50 sm:pr-12 md:w-40 md:flex-none lg:w-56 xl:w-64",
        className,
      )}
      onClick={() => setOpen(true)}
    >
      <Iconify
        icon="tabler:search"
        aria-hidden="true"
        className="-translate-y-1/2 absolute top-1/2 left-1.5"
      />
      <span className="ml-3">{placeholder}</span>
      <kbd className="pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
