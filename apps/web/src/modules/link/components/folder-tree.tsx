import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { FolderTree as FolderTreeDto } from "@workspace/contracts/link";
import { FolderIcon, FolderOpenIcon } from "lucide-react";
import type { ElementType, ReactNode } from "react";
import { TreeView } from "@/components/tree";
import { ScrollArea } from "@/components/ui/scroll-area";
import { orpc } from "@/integrations/orpc";

interface TreeNodeData {
  value: string;
  label: string;
  children?: TreeNodeData[];
  icon?: ElementType;
  iconRender?: (state: { expanded: boolean }) => ReactNode;
  color?: string;
  action?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

type Props = {
  className?: string;
};

function mapPathNodesToTree(nodes: FolderTreeDto[]): TreeNodeData[] {
  return nodes.map((node) => ({
    value: node.path,
    label: node.name,
    children: node.children ? mapPathNodesToTree(node.children) : undefined,
  }));
}

export function FolderTree({ className }: Props) {
  const foldersQuery = useQuery(orpc.link.folderTree.queryOptions());

  const currentPath = useSearch({ from: "/_authenticated/links/", select: (s) => s.path });
  const navigate = useNavigate();

  const onClickHandler = (value: string[]) => {
    const lastValue = value[value.length - 1];
    navigate({ to: ".", search: (s) => ({ ...s, path: lastValue }) });
  };

  const treeData = foldersQuery.data ? mapPathNodesToTree(foldersQuery.data) : [];

  return (
    <div className={className}>
      <div className="border-b p-3">
        <h2 className="font-medium text-sm">Folders</h2>
      </div>

      <ScrollArea className="flex-1 overflow-auto">
        <TreeView
          data={treeData}
          value={currentPath || ""}
          onPathChange={onClickHandler}
          autoCollapse={false}
          syncOpenWithValue
          iconRender={({ expanded }) =>
            expanded ? (
              <FolderOpenIcon className="h-4 w-4 text-primary" />
            ) : (
              <FolderIcon className="h-4 w-4 text-primary" />
            )
          }
        />
      </ScrollArea>
    </div>
  );
}
