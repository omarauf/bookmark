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

/* ------------------------------------------------ Helper ------------------------------------------------ */

function setSetting<K extends keyof SettingStore>(key: K, value: SettingStore[K]) {
  useSettingStore.setState({ [key]: value } as Pick<SettingStore, K>);
}

export function initializeAppearance() {
  const style = useSettingStore.getState().style;

  const html = document.documentElement;
  html.classList.remove("style-one", "style-two", "style-three");
  if (style !== "default") {
    html.classList.add(`style-${style}`);
  }
}
