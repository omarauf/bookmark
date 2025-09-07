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
import { convertOptions } from "./utils";

type Value = string;

type Props<T extends Value> = {
  options: Option<T, Value>[] | T[];
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  className?: string;
};

export function XSelect<T extends Value>({
  options,
  value,
  onChange,
  placeholder,
  label,
  clearable = false,
  className,
}: Props<T>) {
  const [key, setKey] = useState(+Date.now());

  const _options = convertOptions(options);

  return (
    <Select key={key} value={value} onValueChange={onChange as (value: string) => void}>
      <SelectTrigger className={className}>
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
                onChange(undefined);
                setKey(+Date.now());
              }}
            >
              Clear
            </Button>
          </>
        )}
      </SelectContent>
    </Select>
  );
}
