import { ScriptOnce } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  resetTheme: () => void;
  defaultTheme: Theme;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = "vite-ui-theme";

const themeScript = `(function () {
  try {
    const storageKey = '${STORAGE_KEY}';
    const theme = localStorage.getItem(storageKey) || 'system';

    const resolved =
      theme === 'system'
        ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;

    document.documentElement.classList.remove('light','dark');
    document.documentElement.classList.add(resolved);
  } catch (e) {}
})();`;

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  const applyTheme = useCallback((theme: ResolvedTheme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;

    const initialTheme = stored ?? "system";
    setThemeState(initialTheme);

    const resolved = initialTheme === "system" ? getSystemTheme() : initialTheme;

    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [applyTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const listener = () => {
      if (theme === "system") {
        const systemTheme = getSystemTheme();
        setResolvedTheme(systemTheme);
        applyTheme(systemTheme);
      }
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme, applyTheme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(STORAGE_KEY, newTheme);
    setThemeState(newTheme);

    const resolved = newTheme === "system" ? getSystemTheme() : newTheme;

    setResolvedTheme(resolved);
    applyTheme(resolved);
  };

  const resetTheme = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTheme("system");
  };

  return (
    <>
      <ScriptOnce>{themeScript}</ScriptOnce>

      <ThemeContext.Provider
        value={{ theme, resolvedTheme, setTheme, resetTheme, defaultTheme: "system" }}
      >
        {children}
      </ThemeContext.Provider>
    </>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

// import { createContext, useContext, useEffect, useMemo } from "react";
// import { useCookie } from "@/hooks/use-cookie";

// type Theme = "dark" | "light" | "system";
// type ResolvedTheme = Exclude<Theme, "system">;

// const DEFAULT_THEME = "system";
// const THEME_KEY_NAME = "vite-ui-theme";

// type ThemeProviderProps = {
//   children: React.ReactNode;
//   defaultTheme?: Theme;
//   storageKey?: string;
// };

// type ThemeProviderState = {
//   defaultTheme: Theme;
//   resolvedTheme: ResolvedTheme;
//   theme: Theme;
//   setTheme: (theme: Theme) => void;
//   resetTheme: () => void;
// };

// const initialState: ThemeProviderState = {
//   defaultTheme: DEFAULT_THEME,
//   resolvedTheme: "light",
//   theme: DEFAULT_THEME,
//   setTheme: () => null,
//   resetTheme: () => null,
// };

// const ThemeContext = createContext<ThemeProviderState>(initialState);

// export function ThemeProvider({
//   children,
//   defaultTheme = DEFAULT_THEME,
//   storageKey = THEME_KEY_NAME,
//   ...props
// }: ThemeProviderProps) {
//   const [theme, setTheme] = useCookie<Theme>(THEME_KEY_NAME, defaultTheme);

//   // Optimized: Memoize the resolved theme calculation to prevent unnecessary re-computations
//   const resolvedTheme = useMemo((): ResolvedTheme => {
//     if (theme === "system") {
//       if (typeof window === "undefined") {
//         return "light"; // fallback for SSR
//       }

//       return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
//     }
//     return theme as ResolvedTheme;
//   }, [theme]);

//   useEffect(() => {
//     const root = window.document.documentElement;
//     const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

//     const applyTheme = (currentResolvedTheme: ResolvedTheme) => {
//       root.classList.remove("light", "dark"); // Remove existing theme classes
//       root.classList.add(currentResolvedTheme); // Add the new theme class
//     };

//     const handleChange = () => {
//       if (theme === "system") {
//         const systemTheme = mediaQuery.matches ? "dark" : "light";
//         applyTheme(systemTheme);
//       }
//     };

//     applyTheme(resolvedTheme);

//     mediaQuery.addEventListener("change", handleChange);

//     return () => mediaQuery.removeEventListener("change", handleChange);
//   }, [theme, resolvedTheme]);

//   const resetTheme = () => {
//     setTheme(DEFAULT_THEME);
//   };

//   const contextValue = {
//     defaultTheme,
//     resolvedTheme,
//     resetTheme,
//     theme,
//     setTheme,
//   };

//   return (
//     <ThemeContext value={contextValue} {...props}>
//       {children}
//     </ThemeContext>
//   );
// }

// export const useTheme = () => {
//   const context = useContext(ThemeContext);

//   if (!context) throw new Error("useTheme must be used within a ThemeProvider");

//   return context;
// };
