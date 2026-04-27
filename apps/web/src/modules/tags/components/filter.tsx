import { useNavigate, useSearch } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function TagFilter({ className }: Props) {
  const { search } = useSearch({ from: "/_authenticated/tags/" });
  const navigate = useNavigate({ from: "/tags/" });

  const setSearch = (value: string) => {
    navigate({ search: { search: value || undefined } });
  };

  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row", className)}>
      <div className="relative flex-1">
        <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          placeholder="Search tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
