import { Radio } from "@base-ui/react/radio";
import { Star } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {};

export function StarRatingField({ disabled, ...props }: Props) {
  const id = useId();
  const [preview, setPreview] = useState<number>();
  const field = useFieldContext<number | undefined>();

  const value = field.state.value ?? 0;

  const displayedRating = (preview ?? value) / 2;

  return (
    <FormBase id={id} {...props}>
      <div className="flex flex-wrap items-center gap-1">
        <RadioGroup
          aria-label="Rating"
          value={value}
          onValueChange={(nextValue) => {
            if (typeof nextValue === "number") field.handleChange(nextValue);
          }}
          onBlur={field.handleBlur}
          disabled={disabled}
          onMouseLeave={() => setPreview(undefined)}
          className="flex w-auto gap-0"
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const fill = Math.min(1, Math.max(0, displayedRating - star + 1));
            return (
              <Radio.Root
                key={star}
                value={star * 2}
                aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                onMouseEnter={() => {
                  if (!disabled) setPreview(star * 2);
                }}
                className="flex size-7 cursor-pointer items-center justify-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 motion-safe:transition-transform motion-safe:hover:scale-110"
              >
                <span className="relative size-5" aria-hidden="true">
                  <Star className="size-5 text-muted-foreground" />
                  <Star
                    className="absolute inset-0 size-5 fill-current text-yellow-500"
                    style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }}
                  />
                </span>
              </Radio.Root>
            );
          })}
        </RadioGroup>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          aria-label="Clear rating"
          disabled={disabled || value === 0}
          onClick={() => {
            setPreview(undefined);
            field.handleChange(0);
            field.handleBlur();
          }}
        >
          Clear
        </Button>
      </div>
    </FormBase>
  );
}
