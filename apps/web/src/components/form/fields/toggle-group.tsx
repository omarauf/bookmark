import { useId } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { Option } from "@/types/options";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  disabled?: boolean;
  className?: string;
  classNames?: {
    group?: string;
  };
  options: Option<string>[];
  horizontal?: boolean;
};

export function ToggleGroupField({ disabled, className, classNames, horizontal, ...props }: Props) {
  const id = useId();
  const field = useFieldContext<string>();
  const value = field.state.value;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase
      {...props}
      id={id}
      classNames={{
        ...classNames,
        label: cn("cursor-auto", classNames?.label),
      }}
      horizontal={horizontal}
    >
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(val) => val && field.handleChange(val)}
        className={cn("h-9 w-fit! rounded-md bg-muted p-1", className, classNames?.group)}
        data-invalid={isInvalid}
      >
        {props.options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={option.label}
            className="h-7 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {option.icon && <option.icon className="h-4 w-4" />}
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </FormBase>
  );
}
