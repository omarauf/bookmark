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
  clearable?: boolean;
  variant?: "default" | "outline" | "falcon";
  size?: "default" | "sm" | "lg";
  defaultValue?: string;
};

export function ToggleGroupField({
  disabled,
  className,
  classNames,
  horizontal,
  clearable,
  variant,
  size,
  defaultValue,
  ...props
}: Props) {
  const id = useId();
  const field = useFieldContext<string>();
  const value = field.state.value;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const onChangeHandler = (val: string) => {
    if (clearable && val === value) {
      field.handleChange("");
    } else {
      field.handleChange(val);
    }
  };

  return (
    <FormBase
      {...props}
      id={id}
      classNames={{
        ...classNames,
        wrapper: cn("w-fit", classNames?.wrapper),
        label: cn("cursor-auto", classNames?.label),
      }}
      horizontal={horizontal}
    >
      <ToggleGroup
        type="single"
        value={value || defaultValue || ""}
        onValueChange={onChangeHandler}
        variant={variant}
        size={size}
        className={cn("w-fit!", variant === "falcon" && "h-9", className, classNames?.group)}
        data-invalid={isInvalid}
      >
        {props.options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={option.label}
            className={cn(
              variant === "falcon" &&
                "mt-0! h-7 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
            )}
          >
            {option.icon && <option.icon className="h-4 w-4" />}
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </FormBase>
  );
}
