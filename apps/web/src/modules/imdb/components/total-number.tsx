import { useImdbQuery } from "../hooks/use-imdb-query";

export function ImdbTotalNumber() {
  const query = useImdbQuery();
  const total = query.data?.pages[0]?.total ?? 0;

  return (
    <span className="font-mono text-muted-foreground/60">
      Total Items: {total.toLocaleString()}
    </span>
  );
}
