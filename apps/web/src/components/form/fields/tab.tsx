import { useId } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  placeholder?: string;
  dir?: "ltr" | "rtl";
  disabled?: boolean;
  options: string[];
};

export function TabsField({ placeholder, dir, disabled, options, ...props }: Props) {
  const id = useId();
  const field = useFieldContext<string>();
  // const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase id={id} {...props}>
      <Tabs id={id} value={field.state.value} onValueChange={field.handleChange}>
        <TabsList>
          {options.map((option) => (
            <TabsTrigger
              key={option}
              value={option}
              //   onClick={() => field.handleChange(option)}
              //   className={cn(type === option && "font-semibold")}
            >
              {option}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </FormBase>
  );
}
