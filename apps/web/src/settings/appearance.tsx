import { Label } from "@/components/ui/label";
import { Options } from "./common/options";
import { SectionTitle } from "./common/section-title";
import { getAppearanceControls, useSettingStore } from "./hooks/use-store";

const FONT_OPTIONS = {
  sans: [
    { label: "Inter", value: "sans-inter", className: "font-sans-inter" },
    { label: "Manrope", value: "sans-manrope", className: "font-sans-manrope" },
    { label: "DM Sans", value: "sans-dm-sans", className: "font-sans-dm-sans" },
  ],
  serif: [
    { label: "Merriweather", value: "serif-merriweather", className: "font-serif-merriweather" },
    { label: "Playfair", value: "serif-playfair", className: "font-serif-playfair" },
    { label: "Source", value: "serif-source", className: "font-serif-source" },
  ],
  mono: [
    { label: "DefaJetBrainsult", value: "mono-jetbrains", className: "font-mono-jetbrains" },
    { label: "IBM Plex", value: "mono-ibm-plex", className: "font-mono-ibm-plex" },
    { label: "Source Code", value: "mono-source", className: "font-mono-source" },
  ],
};

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
            className="grid-cols-6 max-w-2xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Sans Serif</Label>
          <Options
            items={FONT_OPTIONS.sans}
            value={overrides.fontHead}
            onChange={appearanceControls.setFontHead}
            className="grid-cols-6 max-w-2xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Serif</Label>
          <Options
            items={FONT_OPTIONS.serif}
            value={overrides.fontHead}
            onChange={appearanceControls.setFontHead}
            className="grid-cols-6 max-w-2xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Monospace</Label>
          <Options
            items={FONT_OPTIONS.mono}
            value={overrides.fontHead}
            onChange={appearanceControls.setFontHead}
            className="grid-cols-6 max-w-2xl"
          />
        </div>
      </div>
    </div>
  );
}
