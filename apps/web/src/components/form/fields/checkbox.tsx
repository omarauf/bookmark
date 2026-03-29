import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  legend?: string;
  titleDescription?: string;
};

export function CheckboxField({ legend, titleDescription, ...props }: Props) {
  const id = useId();
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  // return (
  //   <FormBase {...props} id={id} controlFirst horizontal>
  //     <Checkbox
  //       id={id}
  //       name={field.name}
  //       checked={field.state.value}
  //       onBlur={field.handleBlur}
  //       onCheckedChange={(e) => field.handleChange(e === true)}
  //       aria-invalid={isInvalid}
  //     />
  //   </FormBase>
  // );

  return (
    <FieldSet>
      {legend && <FieldLegend className="mb-5 text-sm!">{legend}</FieldLegend>}
      {titleDescription && <FieldDescription>{titleDescription}</FieldDescription>}

      <FormBase {...props} id={id} controlFirst horizontal>
        <Checkbox
          id={id}
          name={field.name}
          checked={field.state.value}
          onBlur={field.handleBlur}
          onCheckedChange={(e) => field.handleChange(e === true)}
          aria-invalid={isInvalid}
        />
      </FormBase>
    </FieldSet>
  );
}
