import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, XCircleIcon } from "lucide-react";
import React from "react";
import { useFieldContext } from ".";
import { FieldErrors } from "./field-errors";

type Props = {
  label?: string;
  className?: string;
};

export function DatePickerField({ label, className }: Props) {
  const field = useFieldContext<Date | undefined>();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const _date =
    typeof field.state.value === "string" ? new Date(field.state.value) : field.state.value;

  const handleOnSelect = (d: Date | undefined) => {
    field.handleChange(d);
    setIsPopoverOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        {label && (
          <label htmlFor={field.name} className="font-medium text-foreground text-sm">
            {label}
          </label>
        )}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              id={field.name}
              variant={"outline"}
              onBlur={field.handleBlur}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !_date && "text-muted-foreground",
                className,
              )}
            >
              <CalendarIcon />
              {_date ? format(_date, "PPP") : <span>{label || "Pick a date"}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex flex-col">
              <Calendar mode="single" selected={_date} onSelect={handleOnSelect} autoFocus />
              {_date && (
                <Button
                  variant="ghost"
                  className="mt-2 self-end"
                  onClick={() => field.handleChange(undefined)}
                >
                  <XCircleIcon className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <FieldErrors meta={field.state.meta} />
    </div>
  );
}
