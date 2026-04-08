import { useNavigate, useSearch } from "@tanstack/react-router";
import { TreeView } from "@/components/tree";
import { cn } from "@/lib/utils";
import { CreateCollectionDialog } from "../collections/create";
import { useCollection } from "../collections/hooks/use-ad-categories";

type Props = {
  className?: string;
};

export function CollectionTree({ className }: Props) {
  const defaultPath = useSearch({ strict: false, select: (s) => s.collectionPath || "" });
  const { data, onClickHandler, pathArray, currentNode } = useCollection({ defaultPath });

  const navigate = useNavigate();

  const onClick = (value: string[]) => {
    const lastValue = value[value.length - 1];
    navigate({ to: ".", search: (s) => ({ ...s, collectionPath: lastValue }) });
    onClickHandler(lastValue);
  };

  return (
    <div className={cn("w-full bg-background", className)}>
      <div className="flex items-center justify-between px-3 pt-2">
        <h3 className="font-bold text-sm">Collections</h3>

        <CreateCollectionDialog parentId={currentNode?.id} />
      </div>

      <TreeView
        data={data}
        value={pathArray}
        onPathChange={onClick}
        className="pt-1"
        autoCollapse={false}
      />
    </div>
  );
}
