import { useSearch } from "@tanstack/react-router";

export function useGridClassName() {
  const { view } = useSearch({ from: "/links/" });

  const gridClassName =
    view === "grid"
      ? "grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      : "flex flex-col gap-3";

  return { gridClassName };
}
