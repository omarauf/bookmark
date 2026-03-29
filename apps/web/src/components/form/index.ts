export * from "./common/form-card";

import { createFormHook } from "@tanstack/react-form";
import { SubmitButton } from "./components/submit-button";
import { fieldContext, formContext } from "./context";
import { AutocompleteField } from "./fields/autocomplete";
import { CheckboxField } from "./fields/checkbox";
import { CheckboxGroupField } from "./fields/checkbox-group";
import { DateField } from "./fields/date";
import { FileUploadField } from "./fields/file";
import { FileImageUploadField } from "./fields/file-image";
import { InputField } from "./fields/input";
import { MultiSelectField } from "./fields/multi-select";
import { NumberField } from "./fields/number";
import { PasswordField } from "./fields/password";
import { RadioField } from "./fields/radio";
import { SelectField } from "./fields/select";
import { SliderRangeField } from "./fields/slider-range";
import { TabsField } from "./fields/tab";
import { TextareaField } from "./fields/textarea";

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    Autocomplete: AutocompleteField,
    Input: InputField,
    File: FileUploadField,
    Image: FileImageUploadField,
    Number: NumberField,
    Password: PasswordField,
    Select: SelectField,
    MultiSelect: MultiSelectField,
    Checkbox: CheckboxField,
    CheckboxGroup: CheckboxGroupField,
    Radio: RadioField,
    Textarea: TextareaField,
    Tabs: TabsField,
    Date: DateField,
    SliderRange: SliderRangeField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
