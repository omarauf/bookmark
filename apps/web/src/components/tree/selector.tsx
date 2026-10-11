import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { ChevronRight, Search } from "lucide-react";
import type { ElementType, MouseEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
   * Selected ids and the changed node. Clearing all selections has no changed node.
   */
  onValueChange: (value: string[], node?: T) => void;
  disabled?: boolean;

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
  disabled = false,
}: TreeViewProps<T>) {
  const nodes = useMemo(() => (Array.isArray(data) ? data : [data]), [data]);
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const visibleNodes = useMemo(() => filterNodes(nodes, query), [nodes, query]);
  const branchIds = useMemo(() => collectBranchIds(visibleNodes), [visibleNodes]);
  const [searchOpenNodes, setSearchOpenNodes] = useState<Set<string>>(new Set());
  const paths = useMemo(() => collectPathNodesForTargets(nodes, value), [nodes, value]);
  const previousPaths = useRef(paths);
  const [openNodes, setOpenNodes] = useState<Set<string>>(paths);
  const activeOpenNodes = query ? searchOpenNodes : openNodes;
  const setActiveOpenNodes = query ? setSearchOpenNodes : setOpenNodes;

  useEffect(() => {
    const previous = previousPaths.current;
    previousPaths.current = paths;
    if (previous.size === paths.size && [...paths].every((id) => previous.has(id))) return;
    setOpenNodes((prev) => {
      const next = new Set(prev);
      for (const node of paths) next.add(node);
      return next;
    });
  }, [paths]);

  const handleNodeClick = useCallback(
    (_: string, node: T, path: string[]) => {
      if (disabled) return;
      // Search prunes children for display, but selection rules use the complete subtree.
      const originalNode = findNode(nodes, node.value) ?? node;
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

      removeDescendants(originalNode);

      // ===== OPEN STATE =====
      if (expandOn === "item") {
        setActiveOpenNodes((prev) => {
          const next = new Set(prev);
          if (next.has(clicked)) next.delete(clicked);
          else next.add(clicked);
          return next;
        });
      } else {
        setActiveOpenNodes((prev) => {
          const next = new Set(prev);
          next.add(clicked);
          return next;
        });
      }

      onValueChange(Array.from(newValue), originalNode);
    },
    [value, expandOn, onValueChange, disabled, nodes, setActiveOpenNodes],
  );

  const handleToggle = useCallback(
    (nodeValue: string) => {
      if (disabled) return;
      setActiveOpenNodes((prev) => {
        const next = new Set(prev);
        if (next.has(nodeValue)) next.delete(nodeValue);
        else next.add(nodeValue);
        return next;
      });
    },
    [disabled, setActiveOpenNodes],
  );

  return (
    <div
      className={cn(
        "flex h-64 min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border",
        className,
      )}
    >
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b p-2">
        <div className="relative min-w-32 flex-1">
          <Search className="absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search tree"
            placeholder="Search..."
            value={search}
            disabled={disabled}
            onChange={(event) => {
              const nextSearch = event.target.value;
              setSearch(nextSearch);
              setSearchOpenNodes(
                collectBranchIds(filterNodes(nodes, nextSearch.trim().toLowerCase())),
              );
            }}
            className="h-7 pl-7 text-xs"
          />
        </div>
        <Button
          type="button"
          size="xs"
          variant="outline"
          disabled={disabled || branchIds.size === 0}
          onClick={() => setActiveOpenNodes(new Set(branchIds))}
        >
          Expand all
        </Button>
        <Button
          type="button"
          size="xs"
          variant="outline"
          disabled={disabled || activeOpenNodes.size === 0}
          onClick={() => setActiveOpenNodes(new Set())}
        >
          Collapse all
        </Button>
        <Button
          type="button"
          size="xs"
          variant="outline"
          disabled={disabled || value.length === 0}
          onClick={() => onValueChange([])}
        >
          Unselect all
        </Button>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        {visibleNodes.length === 0 ? (
          <p className="p-3 text-muted-foreground text-sm" role="status">
            {query ? "No matching options." : "No options available."}
          </p>
        ) : (
          <ul className="flex flex-col gap-1 p-2" role="tree" aria-multiselectable="true">
            {visibleNodes.map((node) => (
              <TreeNode
                key={node.value}
                node={node}
                value={value}
                onNodeClick={handleNodeClick}
                trace={[]}
                openNodes={activeOpenNodes}
                disabled={disabled}
                expandOn={expandOn}
                onToggle={handleToggle}
                icon={icon}
                iconRender={iconRender}
              />
            ))}
          </ul>
        )}
      </ScrollArea>

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
              height: var(--collapsible-panel-height);
            }
          }

          @keyframes slideUp {
            from {
              height: var(--collapsible-panel-height);
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
  disabled?: boolean;
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
  disabled,
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
    if (disabled || node.disabled) return;

    const newPath = [...trace, node.value];
    onNodeClick(node.value, node, newPath);
  };

  const handleChevronClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggle?.(node.value);
  };

  return (
    <li>
      <CollapsiblePrimitive.Root open={isOpen} onOpenChange={() => {}}>
        <div
          aria-hidden="true"
          className={cn(
            "group relative flex w-full flex-1 items-center gap-2 px-2 py-1.5 transition-all",
            "cursor-pointer rounded-md hover:text-accent-foreground",
            isSelected ? "bg-primary text-accent-foreground" : "hover:bg-secondary",
            (disabled || node.disabled) && "pointer-events-none cursor-not-allowed opacity-50",
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

        <CollapsiblePrimitive.Panel
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
                  disabled={disabled}
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
        </CollapsiblePrimitive.Panel>
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

function filterNodes<T extends TreeNodeData>(nodes: T[], query: string): T[] {
  if (!query) return nodes;
  const result: T[] = [];
  for (const node of nodes) {
    if (node.label.toLowerCase().includes(query)) {
      result.push(node);
    } else {
      const children = filterNodes(node.children ?? [], query);
      if (children.length) result.push({ ...node, children });
    }
  }
  return result;
}

function collectBranchIds<T extends TreeNodeData>(nodes: T[]): Set<string> {
  const result = new Set<string>();
  const visit = (current: T[]) => {
    for (const node of current) {
      if (node.children?.length) {
        result.add(node.value);
        visit(node.children);
      }
    }
  };
  visit(nodes);
  return result;
}

function findNode<T extends TreeNodeData>(nodes: T[], value: string): T | undefined {
  for (const node of nodes) {
    if (node.value === value) return node;
    const match = findNode(node.children ?? [], value);
    if (match) return match;
  }
  return undefined;
}

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
