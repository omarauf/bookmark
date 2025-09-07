import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import type React from "react";
import { useFieldContext } from ".";
import { FieldErrors } from "./field-errors";

type TextFieldProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function TextField({ label, ...inputProps }: TextFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor={field.name}>{label}</Label>
        <Input
          id={field.name}
          value={field.state.value || ""}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          {...inputProps}
        />
      </div>
      <FieldErrors meta={field.state.meta} />
    </div>
  );
}
