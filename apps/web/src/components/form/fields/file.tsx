import { useId } from "react";
import { Input } from "@/components/ui/input";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

export function FileUploadField(props: FormControlProps) {
  const field = useFieldContext<File>();
  const id = useId();

  return (
    <FormBase id={id} {...props}>
      <Input
        id={id}
        type="file"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            field.handleChange(e.target.files[0]);
          }
        }}
        onBlur={field.handleBlur}
      />
    </FormBase>
  );
}
