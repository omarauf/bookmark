import { useId } from "react";
import { FieldDescription, FieldLabel, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props<T extends string> = FormControlProps & {
  options: { value: T; label: string; disabled?: boolean }[];
  orientation?: "horizontal" | "vertical";
  classNames?: {
    group?: string;
  };
};

export function RadioField<T extends string = string>({
  options,
  description,
  label,
  orientation,
  classNames,
}: Props<T>) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldSet>
      <FieldLabel>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}

      <RadioGroup
        value={field.state.value}
        onValueChange={field.handleChange}
        onBlur={field.handleBlur}
        orientation={orientation}
        className={cn(
          orientation === "horizontal" ? "grid-flow-col justify-start" : "",
          "",
          classNames?.group,
        )}
      >
        {options.map((option, index) => (
          <RadioItem
            key={option.value}
            option={option.label}
            index={index}
            value={option.value}
            onBlur={field.handleBlur}
            disabled={option.disabled}
            isInvalid={isInvalid}
          />
        ))}
      </RadioGroup>
    </FieldSet>
  );
}

/* -------------------------------------------------------------------------------------------------------- */

type RadioItemProps = {
  option: string;
  value: string;
  index: number;
  onBlur: () => void;
  isInvalid: boolean;
  disabled?: boolean;
};

function RadioItem({ option, index, value, onBlur, isInvalid, disabled }: RadioItemProps) {
  const id = useId();

  return (
    <FormBase
      label={option}
      id={id}
      controlFirst
      horizontal
      classNames={{
        wrapper: "w-fit",
        label: cn(disabled && "cursor-not-allowed text-muted-foreground"),
      }}
    >
      <RadioGroupItem
        key={index}
        id={id}
        value={value}
        onBlur={onBlur}
        aria-invalid={isInvalid}
        disabled={disabled}
      />
    </FormBase>
  );
}
