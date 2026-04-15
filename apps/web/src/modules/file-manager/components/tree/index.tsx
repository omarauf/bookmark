import { useShallow } from "zustand/shallow";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "../../store";
import { TreeNode } from "./node";

export function FileTree() {
  const [tree, currentFolderId, expandedFolders] = useStore(
    useShallow((s) => [s.fileTree, s.currentFolderId, s.expandedFolders]),
  );

  return (
    <div className="flex h-full flex-col border-border border-r bg-card">
      <div className="border-border border-b p-3">
        <h2 className="font-medium text-foreground text-sm">Folders</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2" role="tree" aria-label="File tree">
          <TreeNode
            item={tree}
            level={0}
            isSelected={tree.id === currentFolderId}
            isExpanded={expandedFolders.has(tree.id)}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
