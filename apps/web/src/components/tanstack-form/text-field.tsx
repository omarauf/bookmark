import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
