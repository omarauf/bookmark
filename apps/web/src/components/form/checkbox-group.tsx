import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import type { Option } from "@/types/options";
import { convertOptions } from "./utils";

type Value = string;

type Props<T extends Value> = {
  value: T[];
  title?: string;
  options: Option<T, Value>[] | T[];
  direction?: "row" | "column";
  onChange: (value: T[]) => void;
};

export function XCheckboxGroup<T extends Value>({
  value,
  onChange,
  options,
  title,
  direction = "column",
}: Props<T>) {
  const _options = convertOptions(options);

  const toggleCheckbox = (id: T) => {
    const newValue = value.includes(id) ? value.filter((item) => item !== id) : [...value, id];
    onChange(newValue);
  };

  return (
    <div className={`flex ${direction === "row" ? "flex-row" : "flex-col"} gap-4`}>
      {title && <h3 className="font-medium text-lg">{title}</h3>}

      {_options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <Checkbox
            id={option.value}
            checked={value.includes(option.value)}
            onCheckedChange={() => toggleCheckbox(option.value)}
          />
          <Label htmlFor={option.value}>{option.label}</Label>
        </div>
      ))}
    </div>
  );
}
