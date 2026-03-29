import { useId } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormBase, type FormControlProps } from "../common/form-base";
import { FormFloating } from "../common/form-floating";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  placeholder?: string;
  dir?: "ltr" | "rtl";
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  variant?: "default" | "floating";
  size?: "sm" | "default";
};

export function NumberField({
  placeholder,
  dir,
  disabled,
  className,
  classNames,
  min,
  max,
  step,
  variant = "default",
  size,
  ...props
}: Props) {
  const id = useId();
  const field = useFieldContext<string | number>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const comp = (
    <Input
      id={id}
      name={field.name}
      value={field.state.value ?? ""}
      onBlur={field.handleBlur}
      placeholder={variant === "default" ? placeholder : ""}
      type="number"
      onChange={(e) => field.handleChange(e.target.valueAsNumber)}
      className={cn(className, "transition-none")}
      aria-invalid={isInvalid}
      dir={dir}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      size={size}
    />
  );

  if (variant === "floating") {
    return (
      <FormFloating type="input" id={id} {...props}>
        {comp}
      </FormFloating>
    );
  }

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
      {comp}
    </FormBase>
  );
}
