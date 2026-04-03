import { Root as Radio } from "@radix-ui/react-radio-group";
import type { SVGProps } from "react";
import { IconDir } from "@/assets/custom/icon-dir";
import { useDirection } from "@/settings/context/direction-provider";
import { RadioGroupItem } from "./common/radio-group";
import { SectionTitle } from "./common/section-title";

export function DirConfig() {
  const { defaultDir, dir, setDir } = useDirection();
  return (
    <div>
      <SectionTitle
        title="Direction"
        showReset={defaultDir !== dir}
        onReset={() => setDir(defaultDir)}
      />
      <Radio value={dir} onValueChange={setDir} className="grid w-full max-w-md grid-cols-3 gap-4">
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
      <div>Choose between left-to-right or right-to-left site direction</div>
    </div>
  );
}
