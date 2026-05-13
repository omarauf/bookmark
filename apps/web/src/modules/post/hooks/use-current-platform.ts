import { useSearch } from "@tanstack/react-router";

export function useCurrentPlatform() {
  const platform = useSearch({ from: "/_authenticated/posts", select: (s) => s.platform });

  return platform;
}
