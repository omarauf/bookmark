import { Button } from "@workspace/ui/components/button";
import { Collapsible, CollapsibleContent } from "@workspace/ui/components/collapsible";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { motion } from "framer-motion";
import { ChevronRight, File, Folder, FolderPlus } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface TreeNode {
  path: string;
  name: string;
  children?: TreeNode[];
}

// Props for the Tree component
type TreeProps = {
  data: TreeNode[];
  onSelect?: (path: string) => void;
  defaultExpanded?: string[];
  expanded?: string[];
  onExpandedChange?: (paths: string[]) => void;
  selected: string | undefined;
  filterable?: boolean;
  onCreateFolder?: (parentPath: string) => void;
  onDataChange?: (newData: TreeNode[]) => void;
};

const isFolder = (n: TreeNode) => Array.isArray(n.children);

// Helper function to calculate which folders should be expanded to show a selected path
const calculateExpandedPaths = (data: TreeNode[], selectedPath: string): string[] => {
  const expanded: string[] = [];

  const findPathToNode = (
    nodes: TreeNode[],
    targetPath: string,
    currentPath: string[] = [],
  ): boolean => {
    for (const node of nodes) {
      const newPath = [...currentPath, node.path];

      if (node.path === targetPath) {
        // Found the target, add all parent folders to expanded
        expanded.push(
          ...currentPath.filter((path) => {
            // Find the node for this path and check if it's a folder
            const findNode = (searchNodes: TreeNode[], searchPath: string): TreeNode | null => {
              for (const searchNode of searchNodes) {
                if (searchNode.path === searchPath) return searchNode;
                if (searchNode.children) {
                  const found = findNode(searchNode.children, searchPath);
                  if (found) return found;
                }
              }
              return null;
            };
            const foundNode = findNode(data, path);
            return foundNode ? isFolder(foundNode) : false;
          }),
        );
        return true;
      }

      if (isFolder(node) && node.children) {
        if (findPathToNode(node.children, targetPath, newPath)) {
          return true;
        }
      }
    }
    return false;
  };

  if (selectedPath) {
    findPathToNode(data, selectedPath);
  }

  return expanded;
};

// Tree Row component
function TreeRow({
  node,
  depth,
  isOpen,
  toggle,
  onSelect,
  selected,
  selectedRef,
}: {
  node: TreeNode;
  depth: number;
  isOpen: boolean;
  toggle: () => void;
  onSelect?: (path: string) => void;
  selected: string | undefined;
  selectedRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const paddingLeft = 8 + depth * 16;
  const isSelected = selected === node.path;

  const handleFolderSelect = React.useCallback(() => {
    onSelect?.(node.path);
    // Expand the folder if it's not already open
    if (!isOpen) {
      toggle();
    }
  }, [node.path, onSelect, isOpen, toggle]);

  return (
    <div className="select-none">
      <div
        ref={isSelected ? selectedRef : undefined}
        className={cn(
          "flex items-center gap-2 rounded-lg hover:bg-accent/60",
          isSelected && "bg-accent/80",
        )}
        style={{ paddingLeft }}
      >
        {isFolder(node) ? (
          <div className="flex w-full items-center gap-2 py-1.5 pr-3 text-left">
            <button type="button" className="flex cursor-pointer items-center" onClick={toggle}>
              <motion.span
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <ChevronRight size={16} />
              </motion.span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleFolderSelect();
              }}
              className="flex flex-1 cursor-pointer items-center gap-2"
            >
              <Folder size={16} className="opacity-80" />
              <span className="truncate font-medium text-sm">{node.name}</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onSelect?.(node.path)}
            className="flex w-full items-center gap-2 py-1.5 pr-3 text-left"
          >
            <span className="w-4" />
            <File size={16} className="opacity-80" />
            <span className="truncate text-sm">{node.name}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Recursive branch
function TreeBranch({
  node,
  depth,
  expandedSet,
  setExpanded,
  onSelect,
  selected,
  selectedRef,
}: {
  node: TreeNode;
  depth: number;
  expandedSet: Set<string>;
  setExpanded: (fn: (prev: Set<string>) => Set<string>) => void;
  onSelect?: (path: string) => void;
  selected: string | undefined;
  selectedRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const open = expandedSet.has(node.path);
  const toggle = React.useCallback(() => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (open) next.delete(node.path);
      else next.add(node.path);
      return next;
    });
  }, [open, node.path, setExpanded]);

  if (!isFolder(node)) {
    return (
      <TreeRow
        node={node}
        depth={depth}
        isOpen={false}
        toggle={() => {}}
        onSelect={onSelect}
        selected={selected}
        selectedRef={selectedRef}
      />
    );
  }

  return (
    <Collapsible open={open}>
      <TreeRow
        node={node}
        depth={depth}
        isOpen={open}
        toggle={toggle}
        onSelect={onSelect}
        selected={selected}
        selectedRef={selectedRef}
      />
      <CollapsibleContent>
        <motion.div
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          {node.children?.map((child) => (
            <TreeBranch
              key={child.path}
              selected={selected}
              node={child}
              depth={depth + 1}
              expandedSet={expandedSet}
              setExpanded={setExpanded}
              onSelect={onSelect}
              selectedRef={selectedRef}
            />
          ))}
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function Tree({
  data,
  onSelect,
  selected,
  defaultExpanded,
  expanded,
  onExpandedChange,
  filterable = true,
  onCreateFolder,
  onDataChange,
}: TreeProps) {
  const [query, setQuery] = React.useState("");
  const selectedRef = React.useRef<HTMLDivElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const controlled = React.useMemo(() => expanded !== undefined, [expanded]);
  const [internalExpanded, setInternalExpanded] = React.useState<Set<string>>(
    () => new Set(defaultExpanded ?? []),
  );

  const expandedSet = React.useMemo(
    () => (controlled ? new Set(expanded) : internalExpanded),
    [controlled, expanded, internalExpanded],
  );

  const setExpanded = React.useCallback(
    (updater: (prev: Set<string>) => Set<string>) => {
      if (controlled) {
        const next = updater(new Set(expandedSet));
        onExpandedChange?.(Array.from(next));
      } else {
        setInternalExpanded(updater);
      }
    },
    [controlled, expandedSet, onExpandedChange],
  );

  // Helper function to add a new folder to the tree
  const addFolderToTree = React.useCallback(
    (nodes: TreeNode[], parentPath: string, newFolderName: string): TreeNode[] => {
      if (parentPath === "") {
        // Add to root level
        const newFolder: TreeNode = {
          name: newFolderName,
          path: newFolderName,
        };
        return [...nodes, newFolder];
      }

      return nodes.map((node) => {
        if (node.path === parentPath) {
          // Always treat selected node as a potential folder
          // If it doesn't have children property, it means it's a leaf folder with no contents
          // We should add children to it
          const newFolder: TreeNode = {
            name: newFolderName,
            path: `${parentPath}/${newFolderName}`,
          };

          return {
            ...node,
            children: [...(node.children || []), newFolder],
          };
        }

        if (node.children) {
          // Recursively search in children
          const updatedChildren = addFolderToTree(node.children, parentPath, newFolderName);
          if (updatedChildren !== node.children) {
            return {
              ...node,
              children: updatedChildren,
            };
          }
        }

        return node;
      });
    },
    [],
  );

  // Handle create folder
  const handleCreateFolder = React.useCallback(() => {
    const folderName = prompt("Enter folder name:");
    if (folderName?.trim()) {
      const targetPath = selected || "";

      // All selected nodes should be treated as folders for creation purposes
      // If a node is selected, we want to create a subfolder inside it
      // The server distinguishes between files and folders based on whether they have children

      const newData = addFolderToTree(data, targetPath, folderName.trim());

      onDataChange?.(newData);

      // Expand the parent folder to show the new folder
      if (targetPath) {
        setExpanded((prev) => {
          const next = new Set(prev);
          next.add(targetPath);
          return next;
        });
      }

      onCreateFolder?.(targetPath);
    }
  }, [data, selected, addFolderToTree, onDataChange, onCreateFolder, setExpanded]);

  // Scroll to selected item when selection changes
  React.useEffect(() => {
    if (selectedRef.current && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      ) as HTMLElement;
      if (scrollContainer) {
        const selectedElement = selectedRef.current;
        const containerRect = scrollContainer.getBoundingClientRect();
        const selectedRect = selectedElement.getBoundingClientRect();

        // Check if the selected element is outside the visible area
        const isAbove = selectedRect.top < containerRect.top;
        const isBelow = selectedRect.bottom > containerRect.bottom;

        if (isAbove || isBelow) {
          selectedElement.scrollIntoView({
            behavior: "instant",
            block: "center",
          });
        }
      }
    }
  }, []);

  const filter = React.useCallback(
    (nodes: TreeNode[]): TreeNode[] => {
      if (!query.trim()) return nodes;
      const q = query.toLowerCase();
      const walk = (n: TreeNode): TreeNode | null => {
        if (!isFolder(n)) {
          return n.name.toLowerCase().includes(q) ? n : null;
        }
        const kids = (n.children ?? []).map(walk).filter(Boolean) as TreeNode[];
        if (kids.length > 0 || n.name.toLowerCase().includes(q)) {
          return { ...n, children: kids };
        }
        return null;
      };
      return nodes.map(walk).filter(Boolean) as TreeNode[];
    },
    [query],
  );

  const visible = React.useMemo(() => filter(data), [data, filter]);

  return (
    <div className="w-full max-w-xl text-sm">
      {filterable && (
        <div className="mb-2 flex gap-2">
          <Input
            placeholder="Filter…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="sm" onClick={handleCreateFolder} className="shrink-0">
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="rounded-2xl border p-2">
        <ScrollArea ref={scrollAreaRef} className="h-[400px] pr-3">
          {visible.map((node) => (
            <TreeBranch
              key={node.path}
              node={node}
              depth={0}
              expandedSet={expandedSet}
              setExpanded={setExpanded}
              onSelect={onSelect}
              selected={selected}
              selectedRef={selectedRef}
            />
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}

export function FolderTree({
  initialData,
  selected,
  onSelect,
  onDataChange,
}: {
  initialData: TreeNode[];
  selected?: string | undefined;
  onSelect?: (path: string) => void;
  onDataChange?: (data: TreeNode[]) => void;
}) {
  // Internal data state
  const [data, setData] = React.useState<TreeNode[]>(initialData);

  // Update internal data when initialData changes
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Handle data changes
  const handleDataChange = React.useCallback(
    (newData: TreeNode[]) => {
      setData(newData);
      onDataChange?.(newData);
    },
    [onDataChange],
  );

  // Calculate default expanded paths based on initial selected value or current selected
  const selectedValue = selected;
  const defaultExpanded = React.useMemo(() => {
    return selectedValue ? calculateExpandedPaths(data, selectedValue) : [];
  }, [data, selectedValue]);

  const [expanded, setExpanded] = React.useState<string[]>(defaultExpanded);

  return (
    <div className="space-y-4">
      <Tree
        data={data}
        selected={selected}
        onSelect={onSelect}
        expanded={expanded}
        onExpandedChange={setExpanded}
        onDataChange={handleDataChange}
      />

      <div className="text-muted-foreground text-sm">
        Selected: {selected ? selected : "(none)"}
      </div>
    </div>
  );
}
