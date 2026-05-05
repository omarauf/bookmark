export type Collapsible = "offcanvas" | "icon" | "none";
export type Variant = "inset" | "sidebar" | "floating";
export type Direction = "ltr" | "rtl";
export type Style = "default" | "one" | "two" | "three";
type AppearanceOverrides = {
  radius: number | undefined;
  fontSans: string | undefined;
  fontSerif: string | undefined;
  fontMono: string | undefined;
};

export type SettingStore = {
  collapsible: Collapsible;
  variant: Variant;
  direction: Direction;
  style: Style;
  overrides: AppearanceOverrides;
};
