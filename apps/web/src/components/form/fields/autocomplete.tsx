import { Command as CommandPrimitive } from "cmdk";
import { Loader2, X } from "lucide-react";
import { type KeyboardEvent, useCallback, useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { Option } from "@/types/options";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";
import { convertOptions } from "../utils";

type Value = string;

type Props<T extends Value> = FormControlProps & {
  placeholder?: string;
  options: Option<T, Value>[] | T[];
  onAdd: (value: string) => Promise<void>;
};

export function AutocompleteField<T extends Value>({
  options,
  onAdd,
  placeholder,
  ...props
}: Props<T>) {
  const id = useId();
  const field = useFieldContext<T[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const _options = convertOptions(options);

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
    <FormBase id={id} {...props}>
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
        shouldFilter={false}
      >
        <div
          aria-invalid={isInvalid}
          className={cn(
            "group rounded-md border border-input px-3 py-2 text-sm transition-[color,box-shadow] dark:bg-input/30",
            "ring-offset-background focus-within:ring-[3px] focus-within:ring-ring/50",
            "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          )}
        >
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
              id={id}
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
        {open && (
          <div className="relative mt-2">
            <CommandList>
              <div
                data-state={open ? "open" : "closed"}
                className={cn(
                  "absolute top-0 z-10 w-full animate-in rounded-md border bg-popover text-popover-foreground shadow-md outline-none",
                  "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=open]:animate-in",
                )}
              >
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
                        {/* <Iconify
                            icon="lucide:check"
                            className={cn(
                              "ml-auto h-4 w-4",
                              field.state.value.includes(option.value)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          /> */}
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
            </CommandList>
          </div>
        )}
      </Command>
    </FormBase>
  );
}
