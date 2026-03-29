import { useId } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  disabled?: boolean;
  className?: string;
  step?: number;
};

export function SliderRangeField({ disabled, className, classNames, ...props }: Props) {
  const id = useId();
  const field = useFieldContext<[number, number]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const handleChange = (value: number[]) => {
    field.handleChange([value[0] || 0, value[1] || 0]);
  };

  return (
    <FormBase
      id={id}
      classNames={{
        ...classNames,
        wrapper: cn("group", classNames?.wrapper),
        label: cn("group-focus-within:text-secondary", classNames?.label),
      }}
      {...props}
    >
      <Slider
        id={id}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onValueChange={(e) => handleChange(e)}
        className={cn(className, "transition-none")}
        aria-invalid={isInvalid}
        disabled={disabled}
      />
    </FormBase>
  );
}
