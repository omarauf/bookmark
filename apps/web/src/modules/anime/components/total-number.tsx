import { useAnimeQuery } from "../hooks/use-anime-query";

export function AnimeTotalNumber() {
  const query = useAnimeQuery();
  const total = query.data?.pages[0]?.total ?? 0;

  return <span className="text-muted-foreground/60">Total Items: {total.toLocaleString()}</span>;
}
