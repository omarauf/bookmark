import { Type } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useAppearance } from "@/settings/context/appearance-provider";
import { SectionTitle } from "./common/section-title";

const FONT_OPTIONS = {
  sans: [
    { label: "Default", value: "Default", stack: "" },
    { label: "Outfit", value: "outfit", stack: '"Outfit Variable", sans-serif' },
    { label: "Inter", value: "inter", stack: "Inter, system-ui, sans-serif" },
    { label: "Open Sans", value: "open-sans", stack: "Open Sans, sans-serif" },
    { label: "Manrope", value: "manrope", stack: "Manrope, sans-serif" },
    { label: "System UI", value: "system", stack: "system-ui, sans-serif" },
  ],
  serif: [
    { label: "Default", value: "Default", stack: "" },
    { label: "Georgia", value: "georgia", stack: "Georgia, Times New Roman, serif" },
    { label: "Merriweather", value: "merriweather", stack: "Merriweather, Georgia, serif" },
    { label: "Playfair Display", value: "playfair", stack: '"Playfair Display", Georgia, serif' },
  ],
  mono: [
    { label: "Default", value: "Default", stack: "" },
    { label: "JetBrains Mono", value: "jetbrains", stack: '"JetBrains Mono", Menlo, monospace' },
    { label: "Fira Code", value: "fira", stack: '"Fira Code", Menlo, monospace' },
    { label: "Menlo", value: "menlo", stack: "Menlo, Monaco, monospace" },
    { label: "Courier New", value: "courier", stack: '"Courier New", Courier, monospace' },
  ],
};

export function AppearanceConfig() {
  const {
    defaults,
    overrides,
    setRadius,
    setFontSans,
    setFontSerif,
    setFontMono,
    resetAppearance,
  } = useAppearance();

  const hasCustomAppearance =
    overrides.radius !== defaults.radius ||
    overrides.fontSans !== defaults.fontSans ||
    overrides.fontSerif !== defaults.fontSerif ||
    overrides.fontMono !== defaults.fontMono;

  const radiusValue = overrides.radius ?? 0.875;

  return (
    <div className="space-y-5">
      <SectionTitle title="Appearance" showReset={hasCustomAppearance} onReset={resetAppearance} />

      {/* Radius */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-medium text-sm">Radius</Label>
          <span className="text-muted-foreground text-xs tabular-nums">
            {overrides.radius != null ? `${overrides.radius.toFixed(3)}rem` : "Auto"}
          </span>
        </div>
        <Slider
          value={[radiusValue]}
          min={0}
          max={2}
          step={0.125}
          onValueChange={([v]) => {
            const isDefault = Math.abs(v - 0.875) < 0.001;
            setRadius(isDefault ? null : v);
          }}
        />
      </div>

      {/* Fonts */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-medium text-sm">
          <Type className="size-4" />
          Font Families
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Sans Serif</Label>
          <Select
            value={overrides.fontSans ?? ""}
            onValueChange={(v) => {
              const found = FONT_OPTIONS.sans.find((f) => f.value === v);
              setFontSans(found && found.stack ? found.stack : null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select sans serif font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.sans.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Serif</Label>
          <Select
            value={overrides.fontSerif ?? ""}
            onValueChange={(v) => {
              const found = FONT_OPTIONS.serif.find((f) => f.value === v);
              setFontSerif(found && found.stack ? found.stack : null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select serif font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.serif.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Monospace</Label>
          <Select
            value={overrides.fontMono ?? ""}
            onValueChange={(v) => {
              const found = FONT_OPTIONS.mono.find((f) => f.value === v);
              setFontMono(found && found.stack ? found.stack : null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select monospace font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.mono.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-muted-foreground text-xs">
        Customize corner radius and font families. Select "Default" to use the active style preset.
      </div>
    </div>
  );
}
