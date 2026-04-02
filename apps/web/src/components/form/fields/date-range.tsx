import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useId } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  placeholder?: string;
};

type StringDateRange = {
  from: string | undefined;
  to: string | undefined;
};

export function DateRangeField({ placeholder, ...props }: Props) {
  const id = useId();
  const field = useFieldContext<StringDateRange | undefined>();

  const value = field.state.value;
  const date = value ? toDateRange(value) : undefined;

  const handleChange = (value: DateRange | undefined) => {
    if (!value) return;
    const { from, to } = value;

    field.handleChange({ from: formatDate(from), to: formatDate(to) });
  };

  return (
    <FormBase id={id} {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" id={id} className="justify-start px-2.5 font-normal">
            <CalendarIcon />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} - {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder || "Pick a date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </FormBase>
  );
}

function toDateRange(value: StringDateRange): DateRange {
  return {
    from: value.from ? new Date(value.from) : new Date(),
    to: value.to ? new Date(value.to) : undefined,
  };
}

function formatDate(date?: Date): string | undefined {
  if (!date) return undefined;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
