import { useId } from "react";
import { Input } from "@/components/ui/input";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  label: string;
};

export function ColorField({ label, ...props }: Props) {
  const id = useId();
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase id={id} {...props}>
      <div className="flex gap-2">
        {/* Color picker input */}
        <Input
          type="color"
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          className="h-10 w-12 cursor-pointer p-1"
          aria-invalid={isInvalid}
        />
        {/* Hex value input */}
        <Input
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder="#000000"
          className="flex-1"
          aria-invalid={isInvalid}
        />
      </div>
    </FormBase>
  );
}
