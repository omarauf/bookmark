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
import { useFieldContext } from ".";
import { FieldErrors } from "./field-errors";
import { convertOptions } from "./utils";

type Value = string;

type Props<T extends Value> = {
  options: Option<T, Value>[] | T[];
  label?: string;
  placeholder?: string;
  emptyText?: string;
  className?: string;
};

export function MultiSelectField<T extends Value>({
  options,
  label,
  placeholder = "Select options...",
  emptyText = "No options found.",
  className,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const field = useFieldContext<T[]>();
  const _options = convertOptions(options);

  const handleSelect = useCallback(
    (v: T) => {
      const updatedSelected = field.state.value.includes(v)
        ? field.state.value.filter((item) => item !== v)
        : [...field.state.value, v];
      field.handleChange(updatedSelected);
    },
    [field],
  );

  const selectedLabels = useMemo(
    () =>
      field.state.value
        .map((v) => _options.find((option) => option.value === v)?.label)
        .filter(Boolean)
        .join(", "),
    [field.state.value, _options],
  );

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        {label && (
          <label htmlFor={field.name} className="font-medium text-foreground text-sm">
            {label}
          </label>
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={field.name}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              onBlur={field.handleBlur}
              className={cn("w-full justify-between", className)}
            >
              <span className="truncate">
                {field.state.value.length > 0 ? selectedLabels : placeholder}
              </span>
              <Iconify
                icon="lucide:chevrons-up-down"
                className="ml-2 h-4 w-4 shrink-0 opacity-50"
              />
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
                          field.state.value.includes(option.value) ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <FieldErrors meta={field.state.meta} />
    </div>
  );
}
