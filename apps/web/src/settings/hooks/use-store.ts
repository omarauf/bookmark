import { create, type StateCreator } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { DEFAULT_SETTINGS } from "../constants";
import type { SettingStore } from "../types";

const settingStore: StateCreator<SettingStore> = () => DEFAULT_SETTINGS;

export const useSettingStore = create<SettingStore>()(
  subscribeWithSelector(persist(settingStore, { name: "setting-storage" })),
);

export function getCollapsibleControls() {
  return {
    isChanged: () => useSettingStore.getState().collapsible !== DEFAULT_SETTINGS.collapsible,
    reset: () => setSetting("collapsible", DEFAULT_SETTINGS.collapsible),
    setValue: (value: SettingStore["collapsible"]) => setSetting("collapsible", value),
  };
}

export function getVariantControls() {
  return {
    isChanged: () => useSettingStore.getState().variant !== DEFAULT_SETTINGS.variant,
    reset: () => setSetting("variant", DEFAULT_SETTINGS.variant),
    setValue: (value: SettingStore["variant"]) => setSetting("variant", value),
  };
}

export function getDirectionControls() {
  return {
    isChanged: () => useSettingStore.getState().direction !== DEFAULT_SETTINGS.direction,
    reset: () => setSetting("direction", DEFAULT_SETTINGS.direction),
    setValue: (value: SettingStore["direction"]) => {
      setSetting("direction", value);
      const htmlElement = document.documentElement;
      htmlElement.setAttribute("dir", value);
    },
  };
}

export function getStyleControls() {
  return {
    isChanged: () => useSettingStore.getState().style !== DEFAULT_SETTINGS.style,
    reset: () => setSetting("style", DEFAULT_SETTINGS.style),
    setValue: (value: SettingStore["style"]) => {
      setSetting("style", value);
      const html = document.documentElement;
      html.classList.remove("style-one", "style-two", "style-three");
      if (value !== "default") {
        html.classList.add(`style-${value}`);
      }
    },
  };
}

export function getAppearanceControls() {
  const html = document.documentElement;

  return {
    setRadius: (radius?: number) => {
      if (radius !== undefined) {
        html.style.setProperty("--radius", `${radius}rem`);
      } else {
        html.style.removeProperty("--radius");
      }
      setSetting("overrides", { ...useSettingStore.getState().overrides, radius });
    },
    setFontHead: (fontHead?: string) => applyFont("head", fontHead),
    setFontBody: (fontBody?: string) => applyFont("body", fontBody),
    reset: () => {
      html.style.removeProperty("--radius");
      html.style.removeProperty("--font-head");
      html.style.removeProperty("--font-body");
      setSetting("overrides", DEFAULT_SETTINGS.overrides);
    },
    isChanged: () => {
      const overrides = useSettingStore.getState().overrides;
      const defaultOverrides = DEFAULT_SETTINGS.overrides;
      return (
        overrides.radius !== defaultOverrides.radius ||
        overrides.fontHead !== defaultOverrides.fontHead ||
        overrides.fontBody !== defaultOverrides.fontBody
      );
    },
  };
}

/* ------------------------------------------------ Helper ------------------------------------------------ */

function setSetting<K extends keyof SettingStore>(key: K, value: SettingStore[K]) {
  useSettingStore.setState({ [key]: value } as Pick<SettingStore, K>);
}

function applyFont(cssVar: string, value?: string) {
  const root = document.documentElement;
  const property = cssVar === "head" ? "--font-head" : "--font-body";

  if (value) {
    root.style.setProperty(property, `var(--font-${value})`);
  } else {
    root.style.removeProperty(property);
  }

  setSetting("overrides", {
    ...useSettingStore.getState().overrides,
    [cssVar === "head" ? "fontHead" : "fontBody"]: value,
  });
}

export function initializeAppearance() {
  const root = document.documentElement;
  const overrides = useSettingStore.getState().overrides;
  const style = useSettingStore.getState().style;

  const html = document.documentElement;
  html.classList.remove("style-one", "style-two", "style-three");
  if (style !== "default") {
    html.classList.add(`style-${style}`);
  }

  if (overrides.radius !== undefined) {
    root.style.setProperty("--radius", `${overrides.radius}rem`);
  } else {
    root.style.removeProperty("--radius");
  }

  if (overrides.fontHead) {
    root.style.setProperty("--font-head", `var(--font-${overrides.fontHead})`);
  } else {
    root.style.removeProperty("--font-head");
  }

  if (overrides.fontBody) {
    root.style.setProperty("--font-body", `var(--font-${overrides.fontBody})`);
  } else {
    root.style.removeProperty("--font-body");
  }
}
