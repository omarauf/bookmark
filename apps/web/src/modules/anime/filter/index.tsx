import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { RotateCcw, Search, SlidersHorizontal, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orpc } from "@/integrations/orpc";

export function AnimeFilter() {
  const search = useSearch({ from: "/_authenticated/anime/" });
  const navigate = useNavigate({ from: "/anime/" });

  const genresQuery = useQuery(orpc.anime.genres.queryOptions());

  const syncMutation = useMutation(orpc.anime.sync.mutationOptions());

  const setFilter = (key: string, value: string | undefined | number | boolean) => {
    void navigate({
      search: (prev) => ({ ...prev, [key]: value, page: 1 }),
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 border-border/50 border-b px-6 py-3">
      <div className="relative min-w-50 max-w-sm flex-1">
        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search anime..."
          value={search.q ?? ""}
          onChange={(e) => setFilter("q", e.target.value || undefined)}
          className="h-8 rounded-none border-border/50 pl-8 font-mono text-xs"
        />
      </div>

      <select
        value={search.genre ?? ""}
        onChange={(e) => setFilter("genre", e.target.value || undefined)}
        className="h-8 border border-border/50 bg-transparent px-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider outline-none"
      >
        <option value="">All Genres</option>
        {genresQuery.data?.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <select
        value={search.sortBy ?? "createdAt"}
        onChange={(e) => setFilter("sortBy", e.target.value || undefined)}
        className="h-8 border border-border/50 bg-transparent px-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider outline-none"
      >
        <option value="createdAt">Newest</option>
        <option value="rating">Rating</option>
        <option value="year">Year</option>
      </select>

      <div className="flex items-center gap-1">
        <Star className="h-3 w-3 text-muted-foreground" />
        <Input
          type="number"
          placeholder="Min"
          min={0}
          max={10}
          value={search.minRating ?? ""}
          onChange={(e) =>
            setFilter("minRating", e.target.value ? Number(e.target.value) : undefined)
          }
          className="h-8 w-16 rounded-none border-border/50 font-mono text-xs"
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-8 rounded-none border-border/50 font-mono text-[10px]"
        onClick={() =>
          navigate({
            search: (prev) => ({ ...prev, update: !prev.update }),
          })
        }
      >
        <SlidersHorizontal className="mr-1.5 h-3 w-3" />
        {search.update ? "Done" : "Edit"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-8 rounded-none border-border/50 font-mono text-[10px]"
        onClick={() => {
          syncMutation.mutate(undefined, {
            onSuccess: () => toast.success("Anime sync queued"),
            onError: () => toast.error("Failed to queue sync"),
          });
        }}
        disabled={syncMutation.isPending}
      >
        <RotateCcw className="mr-1.5 h-3 w-3" />
        Sync
      </Button>
    </div>
  );
}
