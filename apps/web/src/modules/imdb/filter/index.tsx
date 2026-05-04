import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Clapperboard, Eye, Film, MonitorPlay, Pen, Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { orpc } from "@/integrations/orpc";

export function ImdbFilter() {
  const search = useSearch({ from: "/_authenticated/imdb/" });
  const navigate = useNavigate({ from: "/imdb/" });

  const genres = useQuery(orpc.imdb.genres.queryOptions());

  const setFilter = (key: string, value: string | undefined | number | boolean) => {
    void navigate({
      search: (prev) => ({ ...prev, [key]: value, page: 1 }),
    });
  };

  const activeKind = search.kind;

  return (
    <div className="flex flex-wrap items-center gap-3 border-border/50 border-b px-6 py-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search titles..."
          value={search.q ?? ""}
          onChange={(e) => setFilter("q", e.target.value || undefined)}
          className="h-7 w-48 rounded-none border-border/50 pl-8 font-mono text-xs"
        />
      </div>

      {/* Kind Toggle */}
      <div className="flex items-center gap-1 border border-border/50">
        <button
          type="button"
          onClick={() => setFilter("kind", activeKind === "movie" ? undefined : "movie")}
          className={`flex h-7 items-center gap-1.5 px-3 font-mono text-[10px] uppercase tracking-widest transition-colors ${
            activeKind === "movie"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Film className="h-3 w-3" />
          Movie
        </button>
        <button
          type="button"
          onClick={() => setFilter("kind", activeKind === "tv" ? undefined : "tv")}
          className={`flex h-7 items-center gap-1.5 px-3 font-mono text-[10px] uppercase tracking-widest transition-colors ${
            activeKind === "tv"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MonitorPlay className="h-3 w-3" />
          TV
        </button>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-1.5">
        <Star className="h-3 w-3 text-muted-foreground" />
        <select
          value={search.sortBy ?? "createdAt"}
          onChange={(e) => setFilter("sortBy", e.target.value)}
          className="h-7 border border-border/50 bg-transparent px-2 font-mono text-[10px] text-muted-foreground uppercase tracking-widest outline-none"
        >
          <option value="createdAt">Added</option>
          <option value="rating">Rating</option>
          <option value="year">Year</option>
        </select>
      </div>

      {/* Genre */}
      <div className="flex items-center gap-1.5">
        <Clapperboard className="h-3 w-3 text-muted-foreground" />
        <select
          value={search.genre ?? ""}
          onChange={(e) => setFilter("genre", e.target.value)}
          className="h-7 border border-border/50 bg-transparent px-2 font-mono text-[10px] text-muted-foreground uppercase tracking-widest outline-none"
        >
          {genres.data?.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Min Rating */}
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          Min
        </span>
        <Input
          type="number"
          min={0}
          max={10}
          step={0.1}
          placeholder="0"
          value={search.minRating ?? ""}
          onChange={(e) => {
            const val = Number.parseFloat(e.target.value);
            setFilter("minRating", Number.isNaN(val) ? undefined : val);
          }}
          className="h-7 w-16 rounded-none border-border/50 font-mono text-xs"
        />
      </div>

      <div className="grow" />

      {/* Kind Toggle */}
      <div className="flex items-center gap-1 border border-border/50">
        <button
          type="button"
          onClick={() => setFilter("update", false)}
          className={`flex h-7 items-center gap-1.5 px-3 font-mono text-[10px] uppercase tracking-widest transition-colors ${
            !search.update
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Eye className="h-3 w-3" />
          View
        </button>
        <button
          type="button"
          onClick={() => setFilter("update", true)}
          className={`flex h-7 items-center gap-1.5 px-3 font-mono text-[10px] uppercase tracking-widest transition-colors ${
            search.update === true
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Pen className="h-3 w-3" />
          Update
        </button>
      </div>
    </div>
  );
}
