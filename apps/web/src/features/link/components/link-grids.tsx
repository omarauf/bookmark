import type { Link } from "@workspace/contracts/link";
import { useShallow } from "zustand/react/shallow";
import { DragSelectContainer, useDragSelect } from "@/components/drag-select";
import { useLinkDragStore } from "../hooks/store";
import { DraggableLink } from "./draggable-link";

type Props = {
  links: Link[];
  className?: string;
};

export function LinkGrid({ links, className }: Props) {
  const [isGlobalDragging, isManualSelecting, setSelectedItems] = useLinkDragStore(
    useShallow((s) => [s.isGlobalDragging, s.isManualSelecting, s.setSelection]),
  );

  const { selectionRect, containerProps } = useDragSelect({
    disabled: isGlobalDragging || isManualSelecting,
    setSelectedItems,
  });

  if (links.length === 0) return null;

  return (
    <DragSelectContainer
      containerProps={containerProps}
      selectionRect={selectionRect}
      className="grow pb-20"
    >
      <div className={className}>
        {links.map((link) => (
          <DraggableLink data-item={link.id} key={link.id} link={link} />
        ))}
      </div>
    </DragSelectContainer>
  );
}
