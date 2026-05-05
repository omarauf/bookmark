import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type Style = "default" | "one" | "two" | "three";

const DEFAULT_STYLE = "default";
const STYLE_KEY_NAME = "app-style";

type StyleContextType = {
  defaultStyle: Style;
  style: Style;
  setStyle: (style: Style) => void;
  resetStyle: () => void;
};

const StyleContext = createContext<StyleContextType | null>(null);

export function StyleProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyle] = useLocalStorage<Style>(STYLE_KEY_NAME, DEFAULT_STYLE);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("style-one", "style-two", "style-three");
    if (style !== "default") {
      html.classList.add(`style-${style}`);
    }
  }, [style]);

  const resetStyle = () => setStyle(DEFAULT_STYLE);

  return (
    <StyleContext
      value={{
        defaultStyle: DEFAULT_STYLE,
        style,
        setStyle,
        resetStyle,
      }}
    >
      {children}
    </StyleContext>
  );
}

export function useStyle() {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error("useStyle must be used within a StyleProvider");
  }
  return context;
}
