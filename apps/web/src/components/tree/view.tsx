import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import type { ElementType, MouseEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

// ================================================================
// TYPES
// ================================================================

interface TreeNodeData {
  value: string;
  label: string;
  children?: this[];
  icon?: ElementType;
  iconRender?: (state: { expanded: boolean }) => ReactNode;
  color?: string;
  action?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

type TreeViewProps<T extends TreeNodeData> = {
  /**
   * The tree data to render.
   * Can be a single root node or an array of root nodes.
   */
  data: T[] | T;

  /**
   * The currently selected value OR full path.
   * - If string: treated as a node value → path will be auto-resolved using `findPath`
   * - If string[]: treated as the full path from root → leaf
   */
  value: string[] | string;

  /**
   * Callback fired when user selects a node.
   * Returns:
   * - value: full path of selected node
   * - node: the actual node object
   */
  onPathChange: (value: string[], node: T) => void;

  /**
   * Optional className for the root container.
   */
  className?: string;

  /**
   * Controls whether tree auto-collapses to only the selected path.
   * - true → only nodes in the selected path stay open
   * - false → multiple branches can stay open
   */
  autoCollapse?: boolean;

  /**
   * Sync open nodes with selected value when autoCollapse is false.
   * - true → ensures selected path nodes are always open
   * - false → open state is fully manual
   */
  syncOpenWithValue?: boolean;

  /**
   * Defines how nodes expand/collapse.
   * - "icon" → only clicking chevron toggles expand
   * - "item" → clicking the whole row toggles expand
   */
  expandOn?: "item" | "icon";

  /**
   * Default icon component for all nodes (if node doesn't define one).
   */
  icon?: ElementType;

  /**
   * Custom render function for icons.
   * Receives:
   * - expanded: whether node is open
   * Useful for dynamic icons (e.g. folder open/closed).
   */
  iconRender?: (state: { expanded: boolean }) => ReactNode;
};

// TODO: move this function to utils since it's used in multiple places (not sure if it's the same as findPath in tree/utils)
function findPath<T extends TreeNodeData>(nodes: T[], target: string): string[] {
  for (const node of nodes) {
    if (node.value === target) return [node.value];
    if (node.children) {
      const childPath = findPath(node.children, target);
      if (childPath.length > 0) return [node.value, ...childPath];
    }
  }
  return [];
}

type TreeNodeProps<T extends TreeNodeData> = {
  node: T;
  value: string[];
  onPathChange: (value: string[], node: T) => void;
  trace: string[];
  autoCollapse?: boolean;
  openNodes?: Set<string>;
  expandOn?: "item" | "icon";
  onToggle?: (nodeValue: string) => void;
  icon?: ElementType;
  iconRender?: (state: { expanded: boolean }) => ReactNode;
};

// ================================================================
// COMPONENT 1: TreeView
// ================================================================

export function TreeView<T extends TreeNodeData>({
  data,
  className,
  value,
  onPathChange,
  autoCollapse = true,
  syncOpenWithValue = true,
  expandOn = "icon",
  icon,
  iconRender,
}: TreeViewProps<T>) {
  const nodes = Array.isArray(data) ? data : [data];
  const path = useMemo(
    () => (typeof value === "string" ? findPath(nodes, value) : value),
    [value, nodes],
  );
  const [openNodes, setOpenNodes] = useState<Set<string>>(new Set(path));

  useEffect(() => {
    if (autoCollapse) {
      setOpenNodes(new Set(path));
    } else if (syncOpenWithValue) {
      setOpenNodes((prev) => {
        const next = new Set(prev);
        for (const node of path) next.add(node);
        return next;
      });
    }
  }, [path, autoCollapse, syncOpenWithValue]);

  const handleNodeClick = useCallback(
    (newPath: string[], node: T) => {
      if (autoCollapse) {
        setOpenNodes(new Set(newPath));
        onPathChange(newPath, node);
      } else if (expandOn === "icon") {
        setOpenNodes((prev) => {
          const next = new Set(prev);
          next.add(node.value);
          return next;
        });
        const isAlreadySelected = path.at(-1) === node.value;
        if (!isAlreadySelected) {
          onPathChange(newPath, node);
        }
      } else {
        setOpenNodes((prev) => {
          const next = new Set(prev);
          if (next.has(node.value)) {
            next.delete(node.value);
          } else {
            next.add(node.value);
          }
          return next;
        });
        const isAlreadySelected = path.at(-1) === node.value;
        if (!isAlreadySelected) {
          onPathChange(newPath, node);
        }
      }
    },
    [autoCollapse, expandOn, onPathChange, path],
  );

  const handleToggle = useCallback((nodeValue: string) => {
    setOpenNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeValue)) {
        next.delete(nodeValue);
      } else {
        next.add(nodeValue);
      }
      return next;
    });
  }, []);

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
            openNodes={openNodes}
            autoCollapse={autoCollapse}
            expandOn={expandOn}
            onToggle={handleToggle}
            icon={icon}
            iconRender={iconRender}
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

function TreeNode<T extends TreeNodeData>({
  node,
  onPathChange,
  value: path,
  trace,
  autoCollapse = true,
  openNodes,
  expandOn = "icon",
  onToggle,
  icon,
  iconRender,
}: TreeNodeProps<T>) {
  const hasChildren = node.children && node.children.length > 0;
  const isOpen =
    expandOn === "icon" || !autoCollapse
      ? [...trace, node.value].every((item) => openNodes?.has(item))
      : [...trace, node.value].every((item, index) => item === path[index]);
  const isSelected = path.at(-1) === node.value;

  const handleItemClick = () => {
    if (node.disabled) return;

    const newPath = [...trace, node.value];
    onPathChange(newPath, node);
  };

  const handleChevronClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggle?.(node.value);
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
          onClick={handleItemClick}
        >
          {node.iconRender ? (
            node.iconRender({ expanded: isOpen })
          ) : node.icon ? (
            <node.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          ) : iconRender ? (
            iconRender({ expanded: isOpen })
          ) : (
            icon && <DefaultIcon component={icon} />
          )}
          {node.color && (
            <div
              className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
              aria-hidden="true"
              style={{ background: node.color }}
            />
          )}
          <span className="grow truncate text-sm">{node.label}</span>
          <TreeActions isSelected={isSelected}>{node.action}</TreeActions>
          {hasChildren &&
            (expandOn === "icon" ? (
              <button
                type="button"
                onClick={handleChevronClick}
                className="shrink-0 rounded-sm p-0.5 hover:bg-secondary"
                tabIndex={-1}
              >
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-90",
                  )}
                  aria-hidden="true"
                />
              </button>
            ) : (
              <ChevronRight
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-90",
                )}
                aria-hidden="true"
              />
            ))}
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
                  trace={[...trace, node.value]}
                  autoCollapse={autoCollapse}
                  openNodes={openNodes}
                  expandOn={expandOn}
                  onToggle={onToggle}
                  icon={icon}
                  iconRender={iconRender}
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

function DefaultIcon({ component: Icon }: { component: ElementType }) {
  return <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />;
}

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
