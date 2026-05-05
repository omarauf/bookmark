import { Label } from "@/components/ui/label";
import { Options } from "./common/options";
import { SectionTitle } from "./common/section-title";
import { getAppearanceControls, useSettingStore } from "./hooks/use-store";

const FONT_OPTIONS = {
  sans: [
    { label: "Default", value: "sans" },
    { label: "Outfit", value: "outfit" },
    { label: "Inter", value: "inter" },
    { label: "Open Sans", value: "open-sans" },
    { label: "Manrope", value: "manrope" },
    { label: "System UI", value: "system" },
  ],
  serif: [
    { label: "Default", value: "serif" },
    { label: "Georgia", value: "georgia" },
    { label: "Merriweather", value: "merriweather" },
    { label: "Playfair Display", value: "playfair" },
  ],
  mono: [
    { label: "Default", value: "mono" },
    { label: "JetBrains Mono", value: "jetbrains" },
    { label: "Fira Code", value: "fira" },
    { label: "Menlo", value: "menlo" },
    { label: "Courier New", value: "courier" },
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

      <div className="grid-cols-2 grid gap-4">
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
            value={overrides.fontSans}
            onChange={appearanceControls.setFontSans}
            className="grid-cols-6 max-w-2xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Serif</Label>
          <Options
            items={FONT_OPTIONS.serif}
            value={overrides.fontSerif}
            onChange={appearanceControls.setFontSerif}
            className="grid-cols-6 max-w-2xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Monospace</Label>
          <Options
            items={FONT_OPTIONS.mono}
            value={overrides.fontMono}
            onChange={appearanceControls.setFontMono}
            className="grid-cols-6 max-w-2xl"
          />
        </div>
      </div>
    </div>
  );
}
