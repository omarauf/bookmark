import { useEffect, useState } from "react";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1792, // 112rem * 16px
  "4xl": 2048, // 128rem * 16px
  "5xl": 2304, // 144rem * 16px
  "6xl": 2560, // 160rem * 16px
  "7xl": 2816, // 176rem * 16px
  "8xl": 3072, // 192rem * 16px
  "9xl": 3328, // 208rem * 16px
};

type Breakpoint = keyof typeof breakpoints;

export function useBreakpoint(): Breakpoint | "base" {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | "base">("base");

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      for (const key of Object.keys(breakpoints).reverse() as Breakpoint[]) {
        if (width >= breakpoints[key]) {
          setBreakpoint(key);
          return;
        }
      }
      setBreakpoint("base");
    }

    handleResize(); // Run at mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}
