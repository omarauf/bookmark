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
      <ScrollArea
        className="pr-3"
        viewportProps={{ className: cn("max-h-120", className, classNames?.viewport) }}
      >
        <TreeSelector
          data={tree}
          value={field.state.value || []}
          onValueChange={field.handleChange}
          className="p-0"
        />
      </ScrollArea>
    </FormBase>
  );
}
