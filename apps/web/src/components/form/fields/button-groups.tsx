import { useId } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  disabled?: boolean;
  className?: string;
  options: { value: string; label: string; color?: string }[] | undefined;
};

export function ButtonGroupField({ disabled, className, classNames, options, ...props }: Props) {
  const id = useId();
  const field = useFieldContext<string[] | undefined>();

  const toggleChange = (value: string) => {
    if (field.state.value?.includes(value)) {
      field.handleChange(field.state.value.filter((v) => v !== value));
    } else {
      field.handleChange([...(field.state.value || []), value]);
    }
  };

  return (
    <FormBase id={id} {...props}>
      <ScrollArea>
        <div className={cn("flex max-h-120 flex-wrap gap-2", className)}>
          {options?.map((option) => {
            const isSelected = field.state.value?.includes(option.value);
            return (
              <Button
                key={option.value}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="border"
                onClick={() => toggleChange(option.value)}
              >
                {option.color && (
                  <span
                    className="mt-1 mr-1 h-3 w-3 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                )}
                {option.label}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </FormBase>
  );
}
