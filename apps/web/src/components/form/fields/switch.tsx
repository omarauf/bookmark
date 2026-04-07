import { useId } from "react";
import { Switch } from "@/components/ui/switch";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  disabled?: boolean;
  className?: string;
};

export function SwitchField({ disabled, className, ...props }: Props) {
  const id = useId();
  const field = useFieldContext<boolean>();
  const value = field.state.value;

  return (
    <FormBase {...props} id={id} horizontal>
      <Switch id={id} checked={value} onCheckedChange={field.handleChange} />
    </FormBase>
  );
}
