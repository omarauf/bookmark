import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, XCircleIcon } from "lucide-react";
import React from "react";

type Props = {
  label?: string;
  date: Date | string | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
};

export function DatePicker({ label, date, setDate, className }: Props) {
  const _date =
    typeof date === "undefined" ? undefined : typeof date === "string" ? new Date(date) : date;
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const handleOnSelect = (d: Date | undefined) => {
    setDate(d);
    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
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
            <Button variant="ghost" className="mt-2 self-end" onClick={() => setDate(undefined)}>
              <XCircleIcon className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
