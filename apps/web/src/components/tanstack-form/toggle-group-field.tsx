import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group";
import type { Option } from "@/types/options";
import { Iconify } from "../iconify";
import { useFieldContext } from ".";
import { FieldErrors } from "./field-errors";
import { convertOptions } from "./utils";

type Value = string;

type Props<T extends Value> = {
  options: Option<T, Value>[] | T[];
  label?: string;
};

export function ToggleGroupField<T extends Value>({ options, label }: Props<T>) {
  const field = useFieldContext<T | undefined>();
  const _options = convertOptions(options);

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        {label && (
          <label htmlFor={field.name} className="font-medium text-foreground text-sm">
            {label}
          </label>
        )}

        <ToggleGroup
          type="single"
          value={field.state.value}
          onValueChange={(v) => {
            field.handleChange(v ? (v as T) : undefined);
            field.handleBlur();
          }}
          className="gap-1"
        >
          {_options.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              aria-label={option.label}
              className="h-8 w-auto min-w-auto rounded-md"
            >
              {option.icon && <Iconify icon={option.icon} className="h-4 w-4" />}
              {option.label && <span>{option.label}</span>}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <FieldErrors meta={field.state.meta} />
    </div>
  );
}
