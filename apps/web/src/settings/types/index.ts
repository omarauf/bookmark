export type Collapsible = "offcanvas" | "icon" | "none";
export type Variant = "inset" | "sidebar" | "floating";
export type Direction = "ltr" | "rtl";
export type Style = "default" | "one" | "two" | "three";

export type SettingStore = {
  collapsible: Collapsible;
  variant: Variant;
  direction: Direction;
  style: Style;
};
