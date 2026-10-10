import { useId } from "react";
import { TreeSelector } from "@/components/tree/selector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { listToTree } from "@/modules/collections/utils";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  disabled?: boolean;
  className?: string;
  classNames?: {
    viewport?: string;
  };
  options: { label: string; value: string; parentId: string | null; color?: string }[] | undefined;
};

export function TreeSelectorField({ disabled, options, className, classNames, ...props }: Props) {
  const id = useId();
  const field = useFieldContext<string[] | undefined>();

  const tree = listToTree(
    options?.map((option) => ({ ...option, id: option.value, slug: option.label })) || [],
  );

  return (
    <FormBase
      id={id}
      classNames={{
        ...classNames,
        label: cn("cursor-auto", classNames?.label),
      }}
      {...props}
    >
      <ScrollArea className={cn("rounded-lg border pr-2", className, classNames?.viewport)}>
        <RenderOptions options={tree} value={field.state.value} handleChange={field.handleChange} />
      </ScrollArea>
    </FormBase>
  );
}

function RenderOptions({
  options,
  value,
  handleChange,
}: {
  options: { value: string; label: string; color?: string }[] | undefined;
  value: string[] | undefined;
  handleChange: (value: string[]) => void;
}) {
  if (options === undefined) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed p-3 text-muted-foreground text-sm">
        Loading options...
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed p-3 text-muted-foreground text-sm">
        No options available.
      </div>
    );
  }

  return (
    <TreeSelector data={options} value={value || []} onValueChange={handleChange} className="p-0" />
  );
}
