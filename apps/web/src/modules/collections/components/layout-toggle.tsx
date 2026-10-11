import { Eye, ListTree } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLayoutStore } from "../../post/controls/layout-store";

export function LayoutToggle() {
  const handleToggleChange = useLayoutStore((s) => s.handleToggleChange);
  const toggleValue = useLayoutStore(useShallow((state) => state.getToggleValue()));

  return (
    <ToggleGroup variant="outline" multiple value={toggleValue} onValueChange={handleToggleChange}>
      <ToggleGroupItem value="tree">
        <ListTree />
      </ToggleGroupItem>

      <ToggleGroupItem value="preview">
        <Eye />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
