import { useNavigate, useSearch } from "@tanstack/react-router";
import { Eye, ListTree } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { XBreadcrumb } from "@/components/breadcrumb";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCollection } from "../collections/hooks/use-ad-categories";
import { useLayoutStore } from "../post/controls/layout-store";

export function CollectionBreadcrumb() {
  const defaultPath = useSearch({ strict: false, select: (s) => s.collectionPath || "" });
  const navigate = useNavigate();
  const { active, pathNode, onClickHandler } = useCollection({ defaultPath });

  const onItemClickHandler = (value: string) => {
    navigate({ to: ".", search: (s) => ({ ...s, collectionPath: value }) });
    onClickHandler(value);
  };

  const handleToggleChange = useLayoutStore((s) => s.handleToggleChange);
  const toggleValue = useLayoutStore(useShallow((state) => state.getToggleValue()));

  return (
    <div className="flex w-full items-center justify-between">
      <XBreadcrumb breadcrumbs={pathNode(active)} onClick={onItemClickHandler} />

      <div>
        <ToggleGroup
          variant="outline"
          type="multiple"
          value={toggleValue}
          onValueChange={handleToggleChange}
        >
          <ToggleGroupItem value="tree">
            <ListTree />
          </ToggleGroupItem>

          <ToggleGroupItem value="preview">
            <Eye />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
