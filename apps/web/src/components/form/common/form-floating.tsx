import type { ReactNode } from "react";
import { Field, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useFieldContext } from "../context";

type FormBaseProps = {
  id: string;
  children: ReactNode;
  label?: string;
  disabled?: boolean;
  classNames?: {
    label?: string;
    error?: string;
    wrapper?: string;
  };
  loading?: boolean;
  type?: "select" | "input" | "multiSelect";
};

const inputClassName = cn(
  "cursor-text",
  "group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:font-medium group-focus-within:text-foreground group-focus-within:text-xs",
  "has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground has-[+input:not(:placeholder-shown)]:text-xs",
);

const selectClassName = cn(
  "cursor-pointer",
  "has-[+button:not([data-placeholder])]:pointer-events-none has-[+button:not([data-placeholder])]:top-0 has-[+button:not([data-placeholder])]:cursor-default has-[+button:not([data-placeholder])]:font-medium has-[+button:not([data-placeholder])]:text-foreground has-[+button:not([data-placeholder])]:text-xs",
);

const multiSelectClassName = cn(
  "cursor-pointer",
  "has-[+_button_div[data-values]]:pointer-events-none has-[+_button_div[data-values]]:top-0 has-[+_button_div[data-values]]:cursor-default has-[+_button_div[data-values]]:font-medium has-[+_button_div[data-values]]:text-foreground has-[+_button_div[data-values]]:text-xs",
);

const classNameTypes = {
  input: inputClassName,
  select: selectClassName,
  multiSelect: multiSelectClassName,
};

export function FormFloating({ children, id, label, classNames, loading, type }: FormBaseProps) {
  const field = useFieldContext();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid} className={cn("group relative h-fit", classNames?.wrapper)}>
      <label
        htmlFor={id}
        data-slot="field-label"
        className={cn(
          "absolute top-1/2 block origin-start -translate-y-1/2 px-2 text-muted-foreground text-sm transition-all",
          classNameTypes[type || "input"],
          loading && "hidden",
        )}
      >
        <span className="inline-flex bg-background px-1">{label}</span>
      </label>
      {children}
      {isInvalid && <FieldError errors={field.state.meta.errors} className={classNames?.error} />}
    </Field>
  );
}
