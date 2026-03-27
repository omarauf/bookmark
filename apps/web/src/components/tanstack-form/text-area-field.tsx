import type React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from ".";
import { FieldErrors } from "./field-errors";

type Props = {
  label?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({ label, ...inputProps }: Props) {
  const field = useFieldContext<string>();

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        {label && <Label htmlFor={field.name}>{label}</Label>}
        <Textarea
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
