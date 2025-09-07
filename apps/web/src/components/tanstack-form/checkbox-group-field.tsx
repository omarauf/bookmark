import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@/lib/utils";
import type { Option } from "@/types/options";
import { useFieldContext } from ".";
import { FieldErrors } from "./field-errors";
import { convertOptions } from "./utils";

type Value = string;

type Props<T extends Value> = {
  title?: string;
  options: Option<T, Value>[] | T[];
  direction?: "row" | "column";
};

export function CheckboxGroupField<T extends Value>({
  options,
  title,
  direction = "column",
}: Props<T>) {
  const field = useFieldContext<T[]>();
  const _options = convertOptions(options);

  return (
    <div className="space-y-2">
      <div className={cn("flex gap-4", direction === "row" ? "flex-row" : "flex-col")}>
        {title && <h3 className="font-medium text-lg">{title}</h3>}

        {_options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={option.value}
              checked={field.state.value.includes(option.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  field.handleChange([...field.state.value, option.value]);
                } else {
                  field.handleChange(field.state.value.filter((item) => item !== option.value));
                }
                // const newValue = field.state.value.includes(option.value)
                //   ? field.state.value.filter((item) => item !== option.value)
                //   : [...field.state.value, option.value];
                // field.handleChange(newValue);
              }}
              onBlur={field.handleBlur}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor={option.value} className="cursor-pointer">
                {option.label}
              </Label>
              {option.info && <p className="text-muted-foreground text-sm">{option.info}</p>}
            </div>
          </div>
        ))}
      </div>

      <FieldErrors meta={field.state.meta} />
    </div>
  );
}
