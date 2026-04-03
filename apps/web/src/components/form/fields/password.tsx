import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  className?: string;
  placeholder?: string;
};

export function PasswordField({ className, placeholder, ...props }: Props) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();

  return (
    <FormBase id={id} {...props}>
      <InputGroup>
        <InputGroupInput
          type={showPassword ? "text" : "password"}
          id={id}
          aria-invalid={isInvalid}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          value={field.state.value}
          placeholder={placeholder}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </FormBase>
  );
}
