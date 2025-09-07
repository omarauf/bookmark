import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group";
import type { Option } from "@/types/options";
import { Iconify } from "../iconify";
import { convertOptions } from "./utils";

type Value = string;

type Props<T extends Value> = {
  options: Option<T, Value>[] | T[];
  value: T | undefined;
  onChange: (value: T | undefined) => void;
};

export function XToggleGroup<T extends Value>({ value, options, onChange }: Props<T>) {
  const _options = convertOptions(options);

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => onChange(v as T)}
      // className="gap-1"
      variant="outline"
    >
      {_options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.label}
          // className="h-8 w-auto min-w-auto rounded-md"
        >
          {option.icon && <Iconify icon={option.icon} className="h-4 w-4" />}
          {option.label && <span>{option.label}</span>}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
