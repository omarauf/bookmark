import { DragToSelect } from "@/components/drag-to-select";
import { useStore } from "../../store";

type Props = {
  children: React.ReactNode;
};

export function DragSelectionArea({ children }: Props) {
  const selectedItems = useStore((s) => s.selectedItems);
  const setSelectedItems = useStore((s) => s.setSelectedItems);

  return (
    <DragToSelect.Root selectedItems={selectedItems} setSelectedItems={setSelectedItems}>
      <DragToSelect.ContainerScrollArea>{children}</DragToSelect.ContainerScrollArea>
    </DragToSelect.Root>
  );
}
