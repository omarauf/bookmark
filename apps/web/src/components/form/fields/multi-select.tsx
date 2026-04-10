import { Loader2 } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectSeparator,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";
import { FormBase, type FormControlProps } from "../common/form-base";
import { FormFloating } from "../common/form-floating";
import { useFieldContext } from "../context";

type Props<T extends string | number> = FormControlProps & {
  placeholder?: string;
  options: { value: T; label: string }[] | undefined;
  className?: string;
  classNames?: {
    content?: string;
  };
  clearable?: boolean;
  variant?: "default" | "floating";
};

export function MultiSelectField<T extends string | number = string>({
  placeholder,
  options,
  disabled,
  className,
  classNames,
  clearable,
  variant = "default",
  ...props
}: Props<T>) {
  const id = useId();
  const field = useFieldContext<string[]>();
  const [key, setKey] = useState(+Date.now());

  const isLoading = !options && !disabled;
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const value = field.state.value;

  const onClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    field.handleChange([]);
    setKey(+Date.now());
  };

  const comp = (
    <MultiSelect
      key={key}
      // disabled
      onValuesChange={field.handleChange}
      values={value || []}
    >
      <MultiSelectTrigger
        aria-invalid={isInvalid}
        id={id}
        onBlur={field.handleBlur}
        className={className}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading...
          </div>
        ) : (
          <MultiSelectValue placeholder={variant === "default" ? placeholder : ""} />
        )}
      </MultiSelectTrigger>
      <MultiSelectContent
        className={cn("max-h-96", classNames?.content)}
        // search={{ emptyMessage: t.notFound, placeholder: t.search }}
        search={false}
      >
        {options && options.length > 0 ? (
          <>
            <MultiSelectGroup className="group">
              {options.map((option) => (
                <MultiSelectItem key={option.value} value={option.value as string}>
                  {option.label}
                </MultiSelectItem>
              ))}
            </MultiSelectGroup>

            {clearable && (
              <MultiSelectGroup>
                <MultiSelectSeparator />
                <Button
                  className="mt-1 w-full"
                  variant="secondary"
                  disabled={disabled || !value.length}
                  size="sm"
                  onClick={onClear}
                >
                  Clear
                </Button>
              </MultiSelectGroup>
            )}
          </>
        ) : (
          <div className="px-2 py-1.5 text-muted-foreground text-sm">No options found.</div>
        )}
      </MultiSelectContent>
    </MultiSelect>
  );

  if (variant === "floating") {
    return (
      <FormFloating
        id={id}
        classNames={classNames}
        {...props}
        loading={isLoading}
        type="multiSelect"
      >
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
