import type { AnyFieldMeta } from "@tanstack/react-form";
import type { ZodError } from "zod";

type FieldErrorsProps = {
  meta: AnyFieldMeta;
};

export function FieldErrors({ meta }: FieldErrorsProps) {
  if (!meta.isTouched) return null;

  return meta.errors.map(({ message }: ZodError, index) => (
    <p key={index} className="font-medium text-destructive text-sm">
      {message}
    </p>
  ));
}
