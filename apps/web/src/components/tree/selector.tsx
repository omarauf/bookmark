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
   * - If string[]: array of selected node ids
   */
  value: string[];

  /**
   * Callback fired when user selects a node.
   * Returns:
   * - value: full path of selected node
   * - node: the actual node object
   */
  onValueChange: (value: string[], node: T) => void;

  /**
   * Optional className for the root container.
   */
  className?: string;

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

// ================================================================
// COMPONENT 1: TreeView
// ================================================================

export function TreeSelector<T extends TreeNodeData>({
  data,
  className,
  value,
  onValueChange,
  expandOn = "icon",
  icon,
  iconRender,
}: TreeViewProps<T>) {
  const nodes = Array.isArray(data) ? data : [data];
  const paths = useMemo(() => collectPathNodesForTargets(nodes, value), [nodes, value]);
  const [openNodes, setOpenNodes] = useState<Set<string>>(paths);

  useEffect(() => {
    setOpenNodes((prev) => {
      const next = new Set(prev);
      for (const node of paths) next.add(node);
      return next;
    });
  }, [paths]);

  const handleNodeClick = useCallback(
    (_: string, node: T, path: string[]) => {
      const newValue = new Set(value);

      const clicked = node.value;

      // Toggle behavior (optional but expected in multi-select)
      const isAlreadySelected = newValue.has(clicked);

      if (isAlreadySelected) {
        newValue.delete(clicked);
      } else {
        newValue.add(clicked);
      }

      // ---- REMOVE ANCESTORS ----
      for (const v of path) {
        if (v !== clicked) {
          newValue.delete(v);
        }
      }

      // ---- REMOVE DESCENDANTS ----
      const removeDescendants = (n: T) => {
        if (!n.children) return;

        for (const child of n.children) {
          newValue.delete(child.value);
          removeDescendants(child);
        }
      };

      removeDescendants(node);

      // ===== OPEN STATE =====
      if (expandOn === "item") {
        setOpenNodes((prev) => {
          const next = new Set(prev);
          if (next.has(clicked)) next.delete(clicked);
          else next.add(clicked);
          return next;
        });
      } else {
        setOpenNodes((prev) => {
          const next = new Set(prev);
          next.add(clicked);
          return next;
        });
      }

      onValueChange(Array.from(newValue), node);
    },
    [value, expandOn, onValueChange],
  );

  const handleToggle = useCallback((nodeValue: string) => {
    setOpenNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeValue)) next.delete(nodeValue);
      else next.add(nodeValue);
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
            paths={paths}
            value={value}
            onNodeClick={handleNodeClick}
            trace={[]}
            openNodes={openNodes}
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

type TreeNodeProps<T extends TreeNodeData> = {
  node: T;
  paths: Set<string>;
  value: string[];
  onNodeClick: (value: string, node: T, path: string[]) => void;
  trace: string[];
  openNodes?: Set<string>;
  expandOn?: "item" | "icon";
  onToggle?: (nodeValue: string) => void;
  icon?: ElementType;
  iconRender?: (state: { expanded: boolean }) => ReactNode;
};

function TreeNode<T extends TreeNodeData>({
  node,
  onNodeClick,
  paths,
  value,
  trace,
  openNodes,
  expandOn = "icon",
  onToggle,
  icon,
  iconRender,
}: TreeNodeProps<T>) {
  const hasChildren = node.children && node.children.length > 0;
  const isOpen = openNodes?.has(node.value) || false;
  const isSelected = value.includes(node.value);

  const handleItemClick = () => {
    if (node.disabled) return;

    const newPath = [...trace, node.value];
    onNodeClick(node.value, node, newPath);
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
                  onNodeClick={onNodeClick}
                  paths={paths}
                  value={value}
                  trace={[...trace, node.value]}
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

// ================================================================
// UTILS
// ================================================================

function collectPathNodesForTargets<T extends TreeNodeData>(
  nodes: T[],
  targets: string[],
): Set<string> {
  const result = new Set<string>();

  function dfs(currentNodes: T[], path: string[]) {
    for (const node of currentNodes) {
      const newPath = [...path, node.value];

      if (targets.includes(node.value)) {
        newPath.forEach((v) => {
          result.add(v);
        });
      }

      if (node.children) {
        dfs(node.children, newPath);
      }
    }
  }

  dfs(nodes, []);
  return result;
}
