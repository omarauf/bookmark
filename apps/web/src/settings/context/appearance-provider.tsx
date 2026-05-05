import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type AppearanceOverrides = {
  radius: number | null;
  fontSans: string | null;
  fontSerif: string | null;
  fontMono: string | null;
};

const DEFAULTS: AppearanceOverrides = {
  radius: null,
  fontSans: null,
  fontSerif: null,
  fontMono: null,
};

const STORAGE_KEY = "app-appearance";

type AppearanceContextType = {
  defaults: AppearanceOverrides;
  overrides: AppearanceOverrides;
  setOverrides: (overrides: AppearanceOverrides) => void;
  setRadius: (radius: number | null) => void;
  setFontSans: (fontSans: string | null) => void;
  setFontSerif: (fontSerif: string | null) => void;
  setFontMono: (fontMono: string | null) => void;
  resetAppearance: () => void;
};

const AppearanceContext = createContext<AppearanceContextType | null>(null);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useLocalStorage<AppearanceOverrides>(STORAGE_KEY, DEFAULTS);

  useEffect(() => {
    const html = document.documentElement;

    if (overrides.radius != null) {
      html.style.setProperty("--radius", `${overrides.radius}rem`);
    } else {
      html.style.removeProperty("--radius");
    }

    if (overrides.fontSans != null && overrides.fontSans.trim() !== "") {
      html.style.setProperty("--font-sans", overrides.fontSans);
    } else {
      html.style.removeProperty("--font-sans");
    }

    if (overrides.fontSerif != null && overrides.fontSerif.trim() !== "") {
      html.style.setProperty("--font-serif", overrides.fontSerif);
    } else {
      html.style.removeProperty("--font-serif");
    }

    if (overrides.fontMono != null && overrides.fontMono.trim() !== "") {
      html.style.setProperty("--font-mono", overrides.fontMono);
    } else {
      html.style.removeProperty("--font-mono");
    }
  }, [overrides]);

  const setRadius = (radius: number | null) => setOverrides({ ...overrides, radius });
  const setFontSans = (fontSans: string | null) => setOverrides({ ...overrides, fontSans });
  const setFontSerif = (fontSerif: string | null) => setOverrides({ ...overrides, fontSerif });
  const setFontMono = (fontMono: string | null) => setOverrides({ ...overrides, fontMono });
  const resetAppearance = () => setOverrides(DEFAULTS);

  return (
    <AppearanceContext
      value={{
        defaults: DEFAULTS,
        overrides,
        setOverrides,
        setRadius,
        setFontSans,
        setFontSerif,
        setFontMono,
        resetAppearance,
      }}
    >
      {children}
    </AppearanceContext>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }
  return context;
}
