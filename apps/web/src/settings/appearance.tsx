import { Label } from "@/components/ui/label";
import { Options } from "./common/options";
import { SectionTitle } from "./common/section-title";
import { getAppearanceControls, useSettingStore } from "./hooks/use-store";

const HEADING_FONTS = [
  { label: "Inter", value: "sans-inter", className: "font-sans-inter" },
  { label: "Manrope", value: "sans-manrope", className: "font-sans-manrope" },
  { label: "DM Sans", value: "sans-dm-sans", className: "font-sans-dm-sans" },
  { label: "Merriweather", value: "serif-merriweather", className: "font-serif-merriweather" },
  { label: "Playfair", value: "serif-playfair", className: "font-serif-playfair" },
  { label: "Source Serif", value: "serif-source", className: "font-serif-source" },
  { label: "JetBrains", value: "mono-jetbrains", className: "font-mono-jetbrains" },
  { label: "IBM Plex", value: "mono-ibm-plex", className: "font-mono-ibm-plex" },
  { label: "Source Code", value: "mono-source", className: "font-mono-source" },
];

const BODY_FONTS = [
  { label: "Inter", value: "sans-inter", className: "font-sans-inter" },
  { label: "Manrope", value: "sans-manrope", className: "font-sans-manrope" },
  { label: "DM Sans", value: "sans-dm-sans", className: "font-sans-dm-sans" },
  { label: "Merriweather", value: "serif-merriweather", className: "font-serif-merriweather" },
  { label: "Playfair", value: "serif-playfair", className: "font-serif-playfair" },
  { label: "Source Serif", value: "serif-source", className: "font-serif-source" },
  { label: "JetBrains", value: "mono-jetbrains", className: "font-mono-jetbrains" },
  { label: "IBM Plex", value: "mono-ibm-plex", className: "font-mono-ibm-plex" },
  { label: "Source Code", value: "mono-source", className: "font-mono-source" },
];

export function AppearanceConfig() {
  const overrides = useSettingStore((s) => s.overrides);
  const appearanceControls = getAppearanceControls();

  const radiusValue = overrides.radius ?? 0.875;

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Appearance"
        showReset={appearanceControls.isChanged()}
        onReset={appearanceControls.reset}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Radius</Label>
          <Options
            items={[
              { label: "None", value: 0 },
              { label: "Default", value: 0.875 },
              { label: "Small", value: 0.25 },
              { label: "Medium", value: 0.5 },
              { label: "Large", value: 0.75 },
              { label: "Extra Large", value: 1 },
            ]}
            value={radiusValue}
            onChange={appearanceControls.setRadius}
            className="max-w-2xl grid-cols-6"
          />
        </div>

        <div className="grid grid-cols-9">
          <p className="font-sans-inter">Inter</p>
          <p className="font-sans-manrope">Manrope</p>
          <p className="font-sans-dm-sans">DM Sans</p>
          <p className="font-serif-merriweather">Merriweather</p>
          <p className="font-serif-playfair">Playfair</p>
          <p className="font-serif-source">Source Serif</p>
          <p className="font-mono-jetbrains">JetBrains</p>
          <p className="font-mono-ibm-plex">IBM Plex</p>
          <p className="font-mono-source">Source Code</p>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Heading Font</Label>
          <Options
            items={HEADING_FONTS}
            value={overrides.fontHead}
            onChange={appearanceControls.setFontHead}
            className="max-w-2xl grid-cols-3"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Body Font</Label>
          <Options
            items={BODY_FONTS}
            value={overrides.fontBody}
            onChange={appearanceControls.setFontBody}
            className="max-w-2xl grid-cols-3"
          />
        </div>
      </div>
    </div>
  );
}
