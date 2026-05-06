export type Collapsible = "offcanvas" | "icon" | "none";
export type Variant = "inset" | "sidebar" | "floating";
export type Direction = "ltr" | "rtl";
export type Style = "default" | "one" | "two" | "three";

type AppearanceOverrides = {
  radius: number | undefined;
  fontHead: string | undefined;
  fontBody: string | undefined;
};

export type SettingStore = {
  collapsible: Collapsible;
  variant: Variant;
  direction: Direction;
  style: Style;
  overrides: AppearanceOverrides;
};
