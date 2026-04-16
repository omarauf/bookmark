import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { FolderTree } from "@workspace/contracts/file-manager";
import { FolderIcon, FolderOpenIcon } from "lucide-react";
import { TreeView } from "@/components/tree";
import { orpc } from "@/integrations/orpc";

export function FileTree() {
  const tree = useQuery(orpc.folder.tree.queryOptions({ input: {} }));
  const folderId = useSearch({ from: "/_authenticated/file-manager/", select: (s) => s.folderId });

  const navigate = useNavigate();
  const onClickHandler = (value: string[]) => {
    const lastValue = value[value.length - 1];
    navigate({ to: ".", search: (s) => ({ ...s, folderId: lastValue }) });
  };

  const mapped: MappedFolderTree[] = tree.data?.map(mapFolderTree) ?? [];

  // TODO: add this to each item in node tree
  // const { setNodeRef, isOver } = useDroppable({
  //   id: item.id,
  //   disabled: false,
  // });

  return (
    <div className="flex h-full flex-col border-border border-r bg-card">
      <div className="border-border border-b p-3">
        <h2 className="font-medium text-foreground text-sm">Folders</h2>
      </div>
      {/* <div className="p-2" role="tree" aria-label="File tree">
        {tree.data?.[0] && (
          <TreeNode
            item={tree.data?.[0]}
            level={0}
            isSelected={tree.data?.[0].id === folderId}
            isExpanded={false}
          />
        )}
      </div> */}

      <TreeView
        data={mapped}
        value={folderId || []}
        onPathChange={onClickHandler}
        className="pt-1"
        autoCollapse={false}
        iconRender={({ expanded }) =>
          expanded ? (
            <FolderOpenIcon className="h-4 w-4 text-blue-500" aria-hidden="true" />
          ) : (
            <FolderIcon className="h-4 w-4 text-blue-500" aria-hidden="true" />
          )
        }
      />
    </div>
  );
}

// TODO: should be moved to a utils file since it's used in multiple places (not sure)
type MappedFolderTree = { value: string; label: string; children: MappedFolderTree[] } & FolderTree;
const mapFolderTree = (node: FolderTree): MappedFolderTree => {
  return {
    ...node,
    value: node.id,
    label: node.name,
    children: node.children?.map(mapFolderTree) ?? [],
  };
};
