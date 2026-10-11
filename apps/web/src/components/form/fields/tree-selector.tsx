import { useId } from "react";
import { TreeSelector } from "@/components/tree/selector";
import { cn } from "@/lib/utils";
import { listToTree } from "@/modules/collections/utils";
import { FormBase, type FormControlProps } from "../common/form-base";
import { useFieldContext } from "../context";

type Props = FormControlProps & {
  disabled?: boolean;
  defaultOpenLevel?: number;
  className?: string;
  classNames?: {
    viewport?: string;
  };
  options: { label: string; value: string; parentId: string | null; color?: string }[] | undefined;
};

export function TreeSelectorField({
  disabled,
  defaultOpenLevel,
  options,
  className,
  classNames,
  ...props
}: Props) {
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
      {tree === undefined ? (
        <div
          role="status"
          className={cn(
            "h-64 min-h-0 min-w-0 rounded-lg border p-3 text-muted-foreground text-sm",
            className,
            classNames?.viewport,
          )}
        >
          Loading options...
        </div>
      ) : (
        <TreeSelector
          data={tree}
          value={field.state.value || []}
          onValueChange={field.handleChange}
          disabled={disabled}
          defaultOpenLevel={defaultOpenLevel}
          className={cn(className, classNames?.viewport)}
        />
      )}
    </FormBase>
  );
}
