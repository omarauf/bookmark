import { useEffect } from "react";
import { useStore } from "../store";

export function useSyncGridColumns(ref: React.RefObject<HTMLElement | null>) {
  const setColumns = useStore((s) => s.setColumns);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const template = getComputedStyle(el).gridTemplateColumns;
      if (!template || template === "none") {
        setColumns(1);
        return;
      }
      setColumns(countGridTracks(template));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, [ref, setColumns]);
}

function countGridTracks(template: string) {
  // Split by spaces, but ignore spaces inside parentheses.
  let depth = 0;
  let tracks = 0;
  let token = "";

  for (const ch of template.trim()) {
    if (ch === "(") depth++;
    if (ch === ")") depth = Math.max(0, depth - 1);

    if (ch === " " && depth === 0) {
      if (token) {
        tracks++;
        token = "";
      }
      continue;
    }

    token += ch;
  }

  if (token) tracks++;
  return tracks;
}
