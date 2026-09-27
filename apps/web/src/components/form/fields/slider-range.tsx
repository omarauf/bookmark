import { useId } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  disabled?: boolean;
  className?: string;
  classNames?: {
    slider?: string;
  };
  step?: number;
};

export function SliderRangeField({ disabled, className, classNames, ...props }: Props) {
  const id = useId();
  const field = useFieldContext<[number, number]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const handleChange = (value: number | readonly number[]) => {
    const arr = Array.isArray(value) ? value : [value];
    field.handleChange([arr[0] ?? 0, arr[1] ?? 0] as [number, number]);
  };

  return (
    <FormBase
      id={id}
      classNames={{
        ...classNames,
        label: cn("cursor-auto", classNames?.label),
      }}
      {...props}
    >
      <Slider
        id={id}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onValueChange={handleChange}
        className={cn("mt-2", className, classNames?.slider)}
        aria-invalid={isInvalid}
        disabled={disabled}
      />
    </FormBase>
  );
}
