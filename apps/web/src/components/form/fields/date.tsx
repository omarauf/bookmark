import { ChevronDownIcon } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  placeholder?: string;
};

export function DateField({ placeholder, ...props }: Props) {
  const field = useFieldContext<Date | undefined>();
  const [open, setOpen] = useState(false);

  const id = useId();
  const date = field.state.value ? new Date(field.state.value) : undefined;

  return (
    <FormBase id={id} {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className="h-11 w-48 justify-between rounded-xl font-normal"
          >
            {date ? date.toLocaleDateString() : placeholder}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(v) => {
              field.handleChange(v);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </FormBase>
  );
}
