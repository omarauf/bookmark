import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import type React from "react";
import { useFieldContext } from ".";
import { FieldErrors } from "./field-errors";

type ColorFieldProps = {
  label: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange">;

export function ColorField({ label, ...inputProps }: ColorFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor={field.name}>{label}</Label>
        <div className="flex gap-2">
          {/* Color picker input */}
          <Input
            id={field.name}
            type="color"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            className="h-10 w-12 cursor-pointer p-1"
            {...inputProps}
          />
          {/* Hex value input */}
          <Input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            placeholder="#000000"
            className="flex-1"
            {...inputProps}
          />
        </div>
      </div>
      <FieldErrors meta={field.state.meta} />
    </div>
  );
}
