import { useQuery } from "@tanstack/react-query";
import type { FolderTree } from "@workspace/contracts/link";
import { FolderIcon, Loader } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { orpc } from "@/integrations/orpc";
import { cn } from "@/lib/utils";
import { useMoveLinks } from "../hooks/use-link-mutations";

interface MoveLinksDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  linkIds: string[];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

function flattenPathNodes(nodes: FolderTree[], prefix = ""): { path: string; name: string }[] {
  const result: { path: string; name: string }[] = [];
  for (const node of nodes) {
    result.push({ path: node.path, name: `${prefix}${node.name}` });
    if (node.children) {
      result.push(...flattenPathNodes(node.children, `${prefix}${node.name}/`));
    }
  }
  return result;
}

export function MoveLinksDialog({
  linkIds,
  showTrigger = true,
  onSuccess,
  ...props
}: MoveLinksDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const [selectedPath, setSelectedPath] = useState("/");
  const foldersQuery = useQuery(orpc.link.folderTree.queryOptions());
  const moveMutation = useMoveLinks();

  const folderList = foldersQuery.data ? flattenPathNodes(foldersQuery.data) : [];

  const onMove = () => {
    moveMutation.mutate(
      { ids: linkIds, path: selectedPath },
      {
        onSuccess: () => {
          props.onOpenChange?.(false);
          onSuccess?.();
        },
      },
    );
  };

  const content = (
    <div className="max-h-64 overflow-auto rounded-md border p-2">
      <button
        type="button"
        onClick={() => setSelectedPath("/")}
        className={cn(
          "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
          selectedPath === "/" && "bg-accent font-medium",
        )}
      >
        <FolderIcon className="h-4 w-4" />
        Root
      </button>
      {folderList.map((folder) => (
        <button
          key={folder.path}
          type="button"
          onClick={() => setSelectedPath(folder.path)}
          className={cn(
            "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent",
            selectedPath === folder.path && "bg-accent font-medium",
          )}
        >
          <FolderIcon className="h-4 w-4" />
          {folder.name}
        </button>
      ))}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <Button variant="outline" size="sm">
            Move ({linkIds.length})
          </Button>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Links</DialogTitle>
            <DialogDescription>
              Move <span className="font-medium">{linkIds.length}</span>
              {linkIds.length === 1 ? " link" : " links"} to a different folder.
            </DialogDescription>
          </DialogHeader>
          {content}
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={onMove} disabled={moveMutation.isPending}>
              {moveMutation.isPending && (
                <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
              )}
              Move
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      {showTrigger ? null : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move Links</DrawerTitle>
          <DrawerDescription>
            Move <span className="font-medium">{linkIds.length}</span>
            {linkIds.length === 1 ? " link" : " links"} to a different folder.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{content}</div>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button onClick={onMove} disabled={moveMutation.isPending}>
            {moveMutation.isPending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Move
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
