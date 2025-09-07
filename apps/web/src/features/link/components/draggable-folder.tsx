import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Folder } from "lucide-react";
import { useClickPath } from "../hooks/use-click-path";

type Props = {
  path: string;
};

export function DroppableFolder({ path }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: `folder-${path}`,
  });
  const { handlePathClick } = useClickPath();

  const lastPathSegment = path.split("/").filter(Boolean).pop() || path;

  return (
    <Card
      ref={setNodeRef}
      className={`cursor-pointer py-0 transition-all duration-200 hover:shadow-md ${
        isOver ? "bg-primary/5 shadow-lg ring-2 ring-primary" : ""
      }`}
      onClick={() => handlePathClick(path)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Folder className={isOver ? "text-primary" : ""} />
          <span
            className={`text-sm ${isOver ? "font-medium text-primary" : "text-muted-foreground"}`}
          >
            {lastPathSegment}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
