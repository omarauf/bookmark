import { Root as Radio } from "@radix-ui/react-radio-group";
import { IconThemeDark } from "@/assets/custom/icon-theme-dark";
import { IconThemeLight } from "@/assets/custom/icon-theme-light";
import { IconThemeSystem } from "@/assets/custom/icon-theme-system";
import { useTheme } from "@/theme/theme-provider";
import { RadioGroupItem } from "./common/radio-group";
import { SectionTitle } from "./common/section-title";

export function ThemeConfig() {
  const { defaultTheme, theme, setTheme } = useTheme();

  return (
    <div>
      <SectionTitle
        title="Theme"
        showReset={theme !== defaultTheme}
        onReset={() => setTheme(defaultTheme)}
      />
      <Radio
        value={theme}
        onValueChange={setTheme}
        className="grid w-full max-w-md grid-cols-3 gap-4"
      >
        {[
          {
            value: "system",
            label: "System",
            icon: IconThemeSystem,
          },
          {
            value: "light",
            label: "Light",
            icon: IconThemeLight,
          },
          {
            value: "dark",
            label: "Dark",
            icon: IconThemeDark,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} isTheme />
        ))}
      </Radio>
      <div>Choose between system preference, light mode, or dark mode</div>
    </div>
  );
}
