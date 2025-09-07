import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useState } from "react";
import type { Option } from "@/types/options";
import { Iconify } from "../iconify";
import { useFieldContext } from ".";
import { FieldErrors } from "./field-errors";
import { convertOptions } from "./utils";

type Value = string;

type Props<T extends Value> = {
  options: Option<T, Value>[] | T[];
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  className?: string;
};

export function SelectField<T extends Value>({
  options,
  placeholder,
  label,
  clearable = false,
  className,
}: Props<T>) {
  const [key, setKey] = useState(+Date.now());
  const field = useFieldContext<T | undefined>();
  const _options = convertOptions(options);

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        {label && (
          <label htmlFor={field.name} className="font-medium text-foreground text-sm">
            {label}
          </label>
        )}

        <Select
          key={key}
          value={field.state.value}
          onValueChange={(val) => field.handleChange(val as T)}
          onOpenChange={(open) => {
            if (!open) field.handleBlur();
          }}
        >
          <SelectTrigger id={field.name} className={className}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {label !== undefined && <SelectLabel>{label}</SelectLabel>}
              {_options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.icon && <Iconify icon={option.icon} className="mr-1" />}
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>

            {clearable && (
              <>
                <SelectSeparator />
                <Button
                  className="w-full px-2"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    field.handleChange(undefined);
                    setKey(+Date.now()); // force reset
                  }}
                >
                  Clear
                </Button>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
      <FieldErrors meta={field.state.meta} />
    </div>
  );
}
