import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props<T extends string[]> = FormControlProps & {
  options: { value: T[number]; label: string; disabled?: boolean }[];
  orientation?: "horizontal" | "vertical";
  classNames?: {
    group?: string;
    item?: string;
  };
};

export function CheckboxGroupField<T extends string[] = string[]>({
  options,
  description,
  label,
  orientation,
  classNames,
}: Props<T>) {
  const field = useFieldContext<string[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldSet>
      <FieldLabel>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}

      <FieldGroup
        data-slot="checkbox-group"
        className={cn(
          orientation === "horizontal"
            ? "flex-row justify-start data-[slot=checkbox-group]:gap-5"
            : "",
          classNames?.group,
        )}
      >
        {options.map((option, index) => (
          <CheckboxItem
            key={option.value}
            option={option.label}
            index={index}
            checked={field.state.value.includes(option.value)}
            onCheckedChange={(checked) => {
              if (checked) field.handleChange([...field.state.value, option.value]);
              else field.handleChange(field.state.value.filter((v) => v !== option.value));
            }}
            onBlur={field.handleBlur}
            isInvalid={isInvalid}
            disabled={option.disabled}
            className={cn(orientation === "horizontal" ? "w-fit" : "", classNames?.item)}
          />
        ))}
      </FieldGroup>
    </FieldSet>
  );
}

/* -------------------------------------------------------------------------------------------------------- */

type CheckboxItemProps = {
  option: string;
  index: number;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onBlur: () => void;
  isInvalid: boolean;
  className?: string;
  disabled?: boolean;
};

function CheckboxItem({
  option,
  index,
  checked,
  onCheckedChange,
  onBlur,
  isInvalid,
  className,
  disabled,
}: CheckboxItemProps) {
  const id = useId();

  // return (
  //   <Label className="flex w-fit cursor-pointer items-center gap-3 rounded-lg border bg-muted px-4 py-2 ring-0 hover:bg-accent/50 has-aria-disabled:cursor-not-allowed has-aria-checked:border-secondary has-aria-checked:ring-[1px] has-aria-checked:ring-secondary">
  //     <Checkbox
  //       key={index}
  //       id={id}
  //       name={option}
  //       checked={checked}
  //       onBlur={onBlur}
  //       disabled={disabled}
  //       onCheckedChange={onCheckedChange}
  //       aria-invalid={isInvalid}
  //       aria-disabled={disabled}
  //       className={cn("data-[state=checked]:border-secondary data-[state=checked]:bg-secondary")}
  //     />
  //     <p>{option}</p>
  //   </Label>
  // );

  return (
    <FormBase
      label={option}
      id={id}
      controlFirst
      horizontal
      disabled={disabled}
      classNames={{
        wrapper: className,
        label: cn("font-normal", disabled && "cursor-not-allowed text-muted-foreground"),
      }}
    >
      <Checkbox
        key={index}
        id={id}
        name={option}
        checked={checked}
        onBlur={onBlur}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-invalid={isInvalid}
        className={cn("data-[state=checked]:border-secondary data-[state=checked]:bg-secondary")}
      />
    </FormBase>
  );
}
