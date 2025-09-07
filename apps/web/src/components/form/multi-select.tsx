import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { useCallback, useMemo, useState } from "react";
import type { Option } from "@/types/options";
import { Iconify } from "../iconify";
import { convertOptions } from "./utils";

type Value = string;

type Props<T extends Value> = {
  options: Option<T, Value>[] | T[];
  value: T[];
  onChange: (value: T[]) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
};

// TODO: https://www.youtube.com/watch?v=pwpCNEROEZc
export function XMultiSelect<T extends Value>({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  emptyText = "No options found.",
  className,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const _options = convertOptions(options);

  const handleSelect = useCallback(
    (v: T) => {
      const updatedSelected = value.includes(v)
        ? value.filter((item) => item !== v)
        : [...value, v];
      onChange(updatedSelected);
    },
    [value, onChange],
  );

  const selectedLabels = useMemo(
    () =>
      value
        .map((v) => _options.find((option) => option.value === v)?.label)
        .filter(Boolean)
        .join(", "),
    [value, _options],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">{value.length > 0 ? selectedLabels : placeholder}</span>
          <Iconify icon="lucide:chevrons-up-down" className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popper-anchor-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search options..." className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {_options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  {option.label}
                  <Iconify
                    icon="lucide:check"
                    className={cn(
                      "ml-auto h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
