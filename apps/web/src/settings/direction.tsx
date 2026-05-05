import { Root as Radio } from "@radix-ui/react-radio-group";
import type { SVGProps } from "react";
import { IconDir } from "@/assets/custom/icon-dir";
import { RadioGroupItem } from "./common/radio-group";
import { SectionTitle } from "./common/section-title";
import { getDirectionControls, useSettingStore } from "./hooks/use-store";

export function DirConfig() {
  const direction = useSettingStore((s) => s.direction);
  const { reset, setValue, isChanged } = getDirectionControls();

  return (
    <div className="space-y-2">
      <SectionTitle title="Direction" showReset={isChanged()} onReset={reset} />
      <Radio
        value={direction}
        onValueChange={setValue}
        className="grid w-full max-w-md grid-cols-3 gap-4"
      >
        {[
          {
            value: "ltr",
            label: "Left to Right",
            icon: (props: SVGProps<SVGSVGElement>) => <IconDir dir="ltr" {...props} />,
          },
          {
            value: "rtl",
            label: "Right to Left",
            icon: (props: SVGProps<SVGSVGElement>) => <IconDir dir="rtl" {...props} />,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <p className="text-sm text-muted-foreground">
        Choose between left-to-right or right-to-left site direction
      </p>
    </div>
  );
}
