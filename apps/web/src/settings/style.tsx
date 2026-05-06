import { Options } from "./common/options";
import { SectionTitle } from "./common/section-title";
import { getStyleControls, useSettingStore } from "./hooks/use-store";

export function StyleConfig() {
  const styleSetting = useSettingStore((s) => s.style);
  const { reset, setValue, isChanged } = getStyleControls();

  const items = [
    { value: "default", label: "Default" },
    { value: "one", label: "Azure" },
    { value: "two", label: "Lime" },
    { value: "three", label: "Indigo" },
  ] as const;

  return (
    <div className="space-y-2">
      <SectionTitle title="Style" showReset={isChanged()} onReset={reset} />

      <Options
        items={items}
        value={styleSetting}
        onChange={setValue}
        className="max-w-md grid-cols-4"
      />

      <p className="text-muted-foreground text-sm">Choose a color palette and typographic style</p>
    </div>
  );
}
