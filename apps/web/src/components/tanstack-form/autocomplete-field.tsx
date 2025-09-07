import { Badge } from "@workspace/ui/components/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@workspace/ui/components/command";
import { cn } from "@workspace/ui/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { Loader2, X } from "lucide-react";
import { type KeyboardEvent, useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { Option } from "@/types/options";
import { Iconify } from "../iconify";
import { useFieldContext } from ".";
import { FieldErrors } from "./field-errors";
import { convertOptions } from "./utils";

type Value = string;

type Props<T extends Value> = {
  label: string;
  placeholder?: string;
  options: Option<T, Value>[] | T[];
  onAdd: (value: string) => Promise<void>;
};

export function AutocompleteField<T extends Value>({
  label,
  options,
  onAdd,
  placeholder,
}: Props<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const _options = convertOptions(options);

  // 🔗 Connect to react-form
  const field = useFieldContext<T[]>();

  const handleUnselect = useCallback(
    (v: string) => {
      field.handleChange(field.state.value.filter((s) => s !== v));
    },
    [field],
  );

  const handleSelect = useCallback(
    (v: T) => {
      const updatedSelected = field.state.value.includes(v)
        ? field.state.value.filter((item) => item !== v)
        : [...field.state.value, v];
      field.handleChange(updatedSelected);
    },
    [field],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const newSelected = [...field.state.value];
            newSelected.pop();
            field.handleChange(newSelected);
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [field],
  );

  const filteredOptions = useMemo(() => {
    const lower = search.toLowerCase();
    return _options
      .filter((option) => String(option.label).toLowerCase().includes(lower))
      .slice(0, 50);
  }, [_options, search]);

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <label htmlFor={field.name} className="font-medium text-foreground text-sm">
          {label}
        </label>
        <Command
          onKeyDown={handleKeyDown}
          className="overflow-visible bg-transparent"
          shouldFilter={false}
        >
          <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <div className="flex flex-wrap gap-1">
              {field.state.value.map((v) => {
                const option = _options.find((o) => o.value === v);
                const label = option?.label || v;
                return (
                  <Badge key={v} variant="secondary">
                    {label}
                    <button
                      type="button"
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUnselect(v);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleUnselect(v)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                );
              })}
              <CommandPrimitive.Input
                ref={inputRef}
                id={field.name}
                value={search}
                onValueChange={setSearch}
                onBlur={() => {
                  setOpen(false);
                  field.handleBlur();
                }}
                onFocus={() => setOpen(true)}
                placeholder={placeholder || "Search..."}
                className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="relative mt-2">
            <CommandList>
              {open && (
                <div className="absolute top-0 z-10 w-full animate-in rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                  <CommandGroup className="max-h-60 overflow-auto">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onSelect={() => {
                            setSearch("");
                            handleSelect(option.value);
                          }}
                          className="cursor-pointer outline-none hover:bg-accent focus:bg-accent"
                        >
                          {option.label}
                          <Iconify
                            icon="lucide:check"
                            className={cn(
                              "ml-auto h-4 w-4",
                              field.state.value.includes(option.value)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))
                    ) : (
                      <CommandItem
                        disabled={loading}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={async () => {
                          setLoading(true);
                          try {
                            await onAdd(search);
                            setSearch("");
                          } catch (error) {
                            toast.error(
                              error instanceof Error ? error.message : "Failed to add item.",
                            );
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          `Create new "${search}"`
                        )}
                      </CommandItem>
                    )}
                  </CommandGroup>
                </div>
              )}
            </CommandList>
          </div>
        </Command>
      </div>
      <FieldErrors meta={field.state.meta} />
    </div>
  );
}
