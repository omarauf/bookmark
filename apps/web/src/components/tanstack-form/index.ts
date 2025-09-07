import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { AutocompleteField } from "./autocomplete-field";
import { CheckboxField } from "./checkbox-field";
import { CheckboxGroupField } from "./checkbox-group-field";
import { ColorField } from "./color-field";
import { DatePickerField } from "./date-picker-field";
import { MultiSelectField } from "./multi-select-field";
import { SelectField } from "./select-field";
import { SubmitButton } from "./submit-button";
import { TextAreaField } from "./text-area-field";
import { TextField } from "./text-field";
import { ToggleGroupField } from "./toggle-group-field";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    CheckboxGroupField,
    CheckboxField,
    SelectField,
    ColorField,
    AutocompleteField,
    DatePickerField,
    MultiSelectField,
    TextAreaField,
    ToggleGroupField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
