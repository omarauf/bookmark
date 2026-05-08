import { useId } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  placeholder?: string;
  dir?: "ltr" | "rtl";
  disabled?: boolean;
  className?: string;
  classNames?: {
    input?: string;
  };
};

export function TextareaField({
  placeholder,
  dir,
  disabled,
  className,
  classNames,
  ...props
}: Props) {
  const id = useId();
  const field = useFieldContext<string | number>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase id={id} classNames={classNames} {...props}>
      <Textarea
        id={id}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        onChange={(e) => field.handleChange(e.target.value)}
        className={cn(className, classNames?.input)}
        aria-invalid={isInvalid}
        dir={dir}
        disabled={disabled}
      />
    </FormBase>
  );
}
