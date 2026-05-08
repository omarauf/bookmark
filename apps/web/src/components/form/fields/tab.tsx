import { useId } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Option } from "@/types/options";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  placeholder?: string;
  dir?: "ltr" | "rtl";
  disabled?: boolean;
  className?: string;
  classNames?: {
    tabs?: string;
  };
  options: Option<string>[];
  defaultValue?: string;
  horizontal?: boolean;
};

export function TabsField({
  placeholder,
  dir,
  disabled,
  className,
  classNames,
  options,
  defaultValue,
  horizontal,
  ...props
}: Props) {
  const id = useId();
  const field = useFieldContext<string | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const value = field.state.value;

  return (
    <FormBase
      id={id}
      {...props}
      classNames={{
        ...classNames,
        label: cn("cursor-auto", classNames?.label),
      }}
      horizontal={horizontal}
    >
      <Tabs
        id={id}
        value={value || defaultValue}
        onValueChange={field.handleChange}
        className={cn(className, classNames?.tabs)}
      >
        <TabsList>
          {options.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              onClick={() => field.handleChange(option.value)}
              className={cn(value === option.value && "font-semibold")}
            >
              <span className={cn(isInvalid && "text-destructive")}>{option.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </FormBase>
  );
}
