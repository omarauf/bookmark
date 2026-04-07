import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import type { ElementType, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// ================================================================
// TYPES
// ================================================================

interface TreeNodeData {
  value: string;
  label: string;
  children?: this[];
  icon?: ElementType;
  color?: string;
  action?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

type TreeViewProps<T extends TreeNodeData> = {
  data: T[] | T;
  value: string[];
  onPathChange: (value: string[], node: T) => void;
  className?: string;
  hideUnselected?: boolean | number;
  autoCollapse?: boolean;
};

type TreeNodeProps<T extends TreeNodeData> = {
  node: T;
  value: string[];
  onPathChange: (value: string[], node: T) => void;
  trace: string[];
  hideUnselected?: boolean | number;
  autoCollapse?: boolean;
  openNodes?: Set<string>;
};

// ================================================================
// COMPONENT 1: TreeView
// ================================================================

export function TreeView<T extends TreeNodeData>({
  data,
  className,
  value: path,
  onPathChange,
  hideUnselected,
  autoCollapse = true,
}: TreeViewProps<T>) {
  const nodes = Array.isArray(data) ? data : [data];
  const [openNodes, setOpenNodes] = useState<Set<string>>(new Set(path));

  useEffect(() => {
    if (autoCollapse) {
      setOpenNodes(new Set(path));
    }
  }, [path, autoCollapse]);

  const handleNodeClick = useCallback(
    (newPath: string[], node: T) => {
      if (autoCollapse) {
        setOpenNodes(new Set(newPath));
        onPathChange(newPath, node);
      } else {
        const isAlreadySelected = path.at(-1) === node.value;
        setOpenNodes((prev) => {
          const next = new Set(prev);
          if (next.has(node.value)) {
            next.delete(node.value);
          } else {
            next.add(node.value);
          }
          return next;
        });
        if (!isAlreadySelected) {
          onPathChange(newPath, node);
        }
      }
    },
    [autoCollapse, onPathChange, path],
  );

  return (
    <div className={cn("relative overflow-auto px-3 py-2", className)} role="tree">
      <ul className="space-y-1">
        {nodes.map((node) => (
          <TreeNode
            key={node.value}
            node={node}
            value={path}
            onPathChange={handleNodeClick}
            trace={[]}
            hideUnselected={hideUnselected}
            openNodes={autoCollapse ? undefined : openNodes}
            autoCollapse={autoCollapse}
          />
        ))}
      </ul>

      <style>
        {`
          .CollapsibleContent {
            overflow: hidden;
          }
          .CollapsibleContent[data-state="open"] {
            animation: slideDown 300ms ease-out;
          }
          .CollapsibleContent[data-state="closed"] {
            animation: slideUp 300ms ease-out;
          }

          @keyframes slideDown {
            from {
              height: 0;
            }
            to {
              height: var(--radix-collapsible-content-height);
            }
          }

          @keyframes slideUp {
            from {
              height: var(--radix-collapsible-content-height);
            }
            to {
              height: 0;
            }
          }
        `}
      </style>
    </div>
  );
}

// ================================================================
// COMPONENT 2: TreeNode (Recursive)
// ================================================================

export function TreeNode<T extends TreeNodeData>({
  node,
  onPathChange,
  value: path,
  trace,
  hideUnselected,
  autoCollapse = true,
  openNodes,
}: TreeNodeProps<T>) {
  const hasChildren = node.children && node.children.length > 0;
  const isOpen = autoCollapse
    ? [...trace, node.value].every((item, index) => item === path[index])
    : [...trace, node.value].every((item) => openNodes?.has(item));
  const isSelected = path.at(-1) === node.value;

  const depth = trace.length;
  const shouldHide =
    hideUnselected === true
      ? !isOpen
      : typeof hideUnselected === "number"
        ? depth >= hideUnselected && !isOpen
        : false;

  if (shouldHide) return null;

  const handleClick = () => {
    if (node.disabled) return;
    onPathChange([...trace, node.value], node);
  };

  return (
    <li>
      <CollapsiblePrimitive.Root open={isOpen}>
        <div
          aria-hidden="true"
          className={cn(
            "group relative flex w-full flex-1 items-center gap-2 px-2 py-1.5 transition-all",
            "cursor-pointer rounded-md hover:text-accent-foreground",
            isSelected ? "bg-primary text-accent-foreground" : "hover:bg-secondary",
            node.disabled && "pointer-events-none cursor-not-allowed opacity-50",
          )}
          onClick={handleClick}
        >
          {node.icon && <node.icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
          {node.color && (
            <div
              className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
              aria-hidden="true"
              style={{ background: node.color }}
            />
          )}
          <span className="grow truncate text-sm">{node.label}</span>
          <TreeActions isSelected={isSelected}>{node.action}</TreeActions>
          {hasChildren && (
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-90",
              )}
              aria-hidden="true"
            />
          )}
        </div>

        <CollapsiblePrimitive.Content
          className={cn(
            node.children && node.children?.length > 0 && "CollapsibleContent", // animation only if has children
            "overflow-hidden text-sm transition-all",
            "ms-4 border-s ps-2",
          )}
        >
          {hasChildren && (
            <ul className="space-y-1 pt-1 pb-1">
              {node.children?.map((child) => (
                <TreeNode
                  key={child.value}
                  node={child}
                  onPathChange={onPathChange}
                  value={path}
                  hideUnselected={hideUnselected}
                  trace={[...trace, node.value]}
                  autoCollapse={autoCollapse}
                  openNodes={openNodes}
                />
              ))}
            </ul>
          )}
        </CollapsiblePrimitive.Content>
      </CollapsiblePrimitive.Root>
    </li>
  );
}

// ================================================================
// UI HELPERS (Internal)
// ================================================================

function TreeActions({ children, isSelected }: { children: ReactNode; isSelected: boolean }) {
  if (!children) return null;
  return (
    <div
      className={cn(
        "absolute right-3", // Removed rtl specific classes for simplicity, add back if needed
        isSelected ? "block" : "hidden group-hover:block",
      )}
    >
      {children}
    </div>
  );
}
