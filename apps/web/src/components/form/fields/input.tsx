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
  type?: "text" | "email" | "password";
  variant?: "default" | "floating";
  clearOnEmpty?: boolean;
};

export function InputField({
  placeholder,
  dir,
  disabled,
  className,
  classNames,
  type,
  variant = "default",
  clearOnEmpty = false,
  ...props
}: Props) {
  const id = useId();
  const field = useFieldContext<string | number | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const handleChange = (value: string) => {
    if (clearOnEmpty && value === "") {
      field.handleChange(undefined);
    } else {
      field.handleChange(value);
    }
  };

  const comp = (
    <Input
      id={id}
      name={field.name}
      value={field.state.value || ""}
      onBlur={field.handleBlur}
      placeholder={variant === "default" ? placeholder : ""}
      type={type}
      onChange={(e) => handleChange(e.target.value)}
      className={cn(className, "transition-none")}
      aria-invalid={isInvalid}
      dir={dir}
      disabled={disabled}
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
