import { Root as Radio } from "@radix-ui/react-radio-group";
import { useStyle } from "@/settings/context/style-provider";
import { RadioGroupItem } from "./common/radio-group";
import { SectionTitle } from "./common/section-title";

export function StyleConfig() {
  const { defaultStyle, style, setStyle } = useStyle();

  return (
    <div>
      <SectionTitle
        title="Style"
        showReset={style !== defaultStyle}
        onReset={() => setStyle(defaultStyle)}
      />
      <Radio
        value={style}
        onValueChange={(v) => setStyle(v as typeof style)}
        className="grid w-full max-w-md grid-cols-4 gap-4"
      >
        {[
          { value: "default", label: "Default" },
          { value: "one", label: "Azure" },
          { value: "two", label: "Lime" },
          { value: "three", label: "Indigo" },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div>Choose a color palette and typographic style</div>
    </div>
  );
}
