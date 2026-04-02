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
  options: Option<string>[];
  defaultValue?: string;
};

export function TabsField({
  placeholder,
  dir,
  disabled,
  className,
  options,
  defaultValue,
  ...props
}: Props) {
  const id = useId();
  const field = useFieldContext<string | undefined>();
  // const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const value = field.state.value;

  return (
    <FormBase id={id} {...props}>
      <Tabs
        id={id}
        value={value || defaultValue}
        onValueChange={field.handleChange}
        className={className}
      >
        <TabsList>
          {options.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              onClick={() => field.handleChange(option.value)}
              className={cn(value === option.value && "font-semibold")}
            >
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </FormBase>
  );
}
