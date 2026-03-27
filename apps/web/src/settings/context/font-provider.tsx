import { createContext, useContext, useEffect } from "react";
import { fonts } from "@/config/fonts";
import { useLocalStorage } from "@/hooks/use-local-storage";

type Font = (typeof fonts)[number];

const FONT_KEY_NAME = "font";

type FontContextType = {
  font: Font;
  setFont: (font: Font) => void;
  resetFont: () => void;
};

const FontContext = createContext<FontContextType | null>(null);

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFont] = useLocalStorage<Font>(FONT_KEY_NAME, fonts[0]);

  useEffect(() => {
    const applyFont = (font: string) => {
      const root = document.documentElement;
      root.classList.forEach((cls) => {
        if (cls.startsWith("font-")) root.classList.remove(cls);
      });
      root.classList.add(`font-${font}`);
    };

    applyFont(font);
  }, [font]);

  const resetFont = () => setFont(fonts[0]);

  return <FontContext value={{ font, setFont, resetFont }}>{children}</FontContext>;
}

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
};
