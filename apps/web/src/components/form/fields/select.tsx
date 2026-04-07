import { Loader2 } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FormBase, type FormControlProps } from "../common/form-base";
import { FormFloating } from "../common/form-floating";
import { useFieldContext } from "../context";

type Props<T extends string | number> = FormControlProps & {
  placeholder?: string;
  options: { value: T; label: string }[] | undefined;
  className?: string;
  horizontal?: boolean;
  classNames?: {
    content?: string;
  };
  variant?: "default" | "floating";
  clearable?: boolean;
  icon?: React.ReactNode;
};

export function SelectField<T extends string | number = string>({
  placeholder,
  options,
  disabled,
  className,
  classNames,
  variant = "default",
  clearable,
  icon,
  ...props
}: Props<T>) {
  const id = useId();
  const field = useFieldContext<T>();
  const [key, setKey] = useState(+Date.now());

  const isLoading = !options && !disabled;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const value = field.state.value;
  const type = typeof value;

  const onChangeHandler = (c: string) => {
    const newValue = type === "number" ? Number(c) : c;
    field.handleChange(newValue as T);
  };

  const onClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    field.handleChange(null as unknown as T);
    setKey(+Date.now());
  };

  const comp = (
    <Select
      key={key}
      disabled={disabled}
      onValueChange={onChangeHandler}
      value={(value as string) ?? ""}
    >
      <SelectTrigger
        aria-invalid={isInvalid}
        id={id}
        onBlur={field.handleBlur}
        className={cn(icon && "relative ps-9", className)}
      >
        {icon && (
          <div className="pointer-events-none absolute inset-s-0 inset-y-0 flex items-center justify-center ps-3 text-muted-foreground/80 group-has-[select[disabled]]:opacity-50">
            {icon}
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading...
          </div>
        ) : (
          <SelectValue placeholder={variant === "default" ? placeholder : ""} />
        )}
      </SelectTrigger>
      <SelectContent className={cn("max-h-96", classNames?.content)}>
        {options && options.length > 0 ? (
          <>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value as string}>
                {option.label}
              </SelectItem>
            ))}

            {clearable && (
              <>
                <SelectSeparator />
                <Button
                  className="w-full px-2"
                  variant="secondary"
                  disabled={disabled || !value}
                  size="sm"
                  onClick={onClear}
                >
                  Clear
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="px-2 py-1.5 text-muted-foreground text-sm">No options available</div>
        )}
      </SelectContent>
    </Select>
  );

  if (variant === "floating") {
    return (
      <FormFloating id={id} classNames={classNames} {...props} loading={isLoading} type="select">
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
        label: cn("group-has-data-[state=open]:text-secondary", classNames?.label),
      }}
      {...props}
    >
      {comp}
    </FormBase>
  );
}
