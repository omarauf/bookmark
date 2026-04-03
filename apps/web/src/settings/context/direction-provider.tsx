import { DirectionProvider as RdxDirProvider } from "@radix-ui/react-direction";
import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type Direction = "ltr" | "rtl";

const DEFAULT_DIRECTION = "ltr";
const DIRECTION_KEY_NAME = "dir";

type DirectionContextType = {
  defaultDir: Direction;
  dir: Direction;
  setDir: (dir: Direction) => void;
  resetDir: () => void;
};

const DirectionContext = createContext<DirectionContextType | null>(null);

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [dir, setDir] = useLocalStorage<Direction>(DIRECTION_KEY_NAME, DEFAULT_DIRECTION);

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("dir", dir);
  }, [dir]);

  const resetDir = () => setDir(DEFAULT_DIRECTION);

  return (
    <DirectionContext
      value={{
        defaultDir: DEFAULT_DIRECTION,
        dir,
        setDir,
        resetDir,
      }}
    >
      <RdxDirProvider dir={dir}>{children}</RdxDirProvider>
    </DirectionContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDirection() {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error("useDirection must be used within a DirectionProvider");
  }
  return context;
}
