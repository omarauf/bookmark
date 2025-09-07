import { useEffect } from "react";
import { useLinkDragStore } from "./store";

type UseSelectAllProps = {
  data: string[];
};

export function useSelectAll({ data }: UseSelectAllProps) {
  const setSelection = useLinkDragStore((s) => s.setSelection);
  const selectedIds = useLinkDragStore((s) => s.selectedIds);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();

        if (selectedIds.size > 0) {
          setSelection(new Set());
        } else {
          setSelection(new Set(data));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data, setSelection, selectedIds]);
}
