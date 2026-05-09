import { type ComponentType, type SVGProps, useId } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormBase, type FormControlProps } from "../common/form-base";
import { FormFloating } from "../common/form-floating";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  placeholder?: string;
  dir?: "ltr" | "rtl";
  disabled?: boolean;
  type?: "text" | "email" | "password";
  variant?: "default" | "floating";
  clearOnEmpty?: boolean;
  className?: string;
  classNames?: {
    input?: string;
  };
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  size?: "sm" | "default";
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
  icon: Icon,
  size,
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
      className={cn(Icon && "ps-9", classNames?.input)}
      aria-invalid={isInvalid}
      dir={dir}
      disabled={disabled}
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
        wrapper: cn(Icon && "relative", classNames?.wrapper),
      }}
      {...props}
    >
      {comp}
      {Icon && (
        <div className="pointer-events-none absolute inset-s-0 inset-y-0 flex items-center ps-3 text-muted-foreground/80 group-has-[select[disabled]]:opacity-50">
          <Icon className="size-4" />
        </div>
      )}
    </FormBase>
  );
}
