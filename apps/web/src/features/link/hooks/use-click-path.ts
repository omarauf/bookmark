import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import { useLinkDragStore } from "./store";

export function useClickPath() {
  const clearSelection = useLinkDragStore((s) => s.clearSelection);
  const search = useSearch({ from: "/links/" });
  const navigate = useNavigate({ from: "/links" });

  const handlePathClick = useCallback(
    (f?: string) => {
      clearSelection();
      navigate({ to: "/links", search: { ...search, path: f }, state: { skipLoadingBar: true } });
    },
    [search, clearSelection, navigate],
  );

  return { handlePathClick };
}
