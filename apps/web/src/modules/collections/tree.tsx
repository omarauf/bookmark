import type { CollectionTree } from "@workspace/contracts/collection";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateCollectionDialog } from "./create";
import { DeleteCollectionDialog } from "./delete";
import { UpdateCollectionDialog } from "./update";

type Props = {
  nodes: CollectionTree[];
};

export function RenderCollectionTree({ nodes }: Props) {
  if (nodes.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No collections found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {nodes.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
}

function TreeNode({ node }: { node: CollectionTree }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="group flex items-center justify-between gap-3 p-3 hover:bg-muted/50">
        <div className="flex items-center gap-2">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="h-6 w-6" />
          )}

          <div className="flex flex-1 items-center gap-3">
            {node.color && (
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: node.color }}
              />
            )}

            <h3 className="mb-1 font-medium text-foreground">{node.label}</h3>

            <Badge variant="outline" className="mt-px text-xs">
              Level {node.level}
            </Badge>

            {hasChildren && (
              <Badge variant="outline" className="text-xs">
                {node.children.length} {node.children.length === 1 ? "child" : "children"}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <CreateCollectionDialog parentId={node.id} />
          <UpdateCollectionDialog collection={node} />
          <DeleteCollectionDialog collection={node} />
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="border-border border-t bg-muted/30 p-3 pl-10">
          <div className="space-y-2">
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
