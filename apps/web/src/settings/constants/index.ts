import type { SettingStore } from "../types";

export const DEFAULT_SETTINGS: SettingStore = {
  collapsible: "icon",
  variant: "inset",
  direction: "ltr",
  style: "default",
  overrides: {
    radius: undefined,
    fontSans: "sans",
    fontSerif: "serif",
    fontMono: "mono",
  },
};
