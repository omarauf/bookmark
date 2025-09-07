import { useDraggable } from "@dnd-kit/core";
import type { Link } from "@workspace/contracts/link";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@workspace/ui/components/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@workspace/ui/components/hover-card";
import { cn } from "@workspace/ui/lib/utils";
import { MoreVertical } from "lucide-react";
import React from "react";
import { useShallow } from "zustand/react/shallow";
import { useLinkSettingStore } from "@/apps/settings/links/use-store";
import { env } from "@/config/env";
import { LinkDeleteDialog } from "../dialogs/delete";
import { LinkMoveDialog } from "../dialogs/move";
import { LinkRenameDialog } from "../dialogs/rename";
import { useLinkDragStore } from "../hooks/store";
import { getDomainAndTLD } from "../utils";
import { LinkPreview } from "./link-preview";

interface Props {
  link: Link;
  "data-item"?: string;
}

export function DraggableLink({ link, ...rest }: Props) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState<"rename" | "move" | "delete">();
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const popup = useLinkSettingStore((s) => s.popup);
  const isDialogOpen = dialogType !== undefined;

  const [toggleSelection, isSelected, selectedCount, isGlobalDragging] = useLinkDragStore(
    useShallow((s) => [s.toggleSelection, s.isSelected, s.selectedIds.size, s.isGlobalDragging]),
  );

  const selected = isSelected(link.id);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.ctrlKey || e.metaKey) {
      toggleSelection(link.id);
    }
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: link.id,
    // if there are multiple selected, only drag if this item is selected
    disabled: selectedCount > 1 ? !selected : false,
  });

  // const style = transform
  //   ? {
  //       transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  //     }
  //   : undefined;

  const onDialogClose = () => {
    setDialogType(undefined);
    setIsPreviewOpen(false);
  };

  return (
    <HoverCard
      openDelay={500}
      open={popup && (isMenuOpen || isDragging || isDialogOpen ? false : isPreviewOpen)}
      onOpenChange={setIsPreviewOpen}
    >
      <HoverCardTrigger asChild>
        <Card
          ref={setNodeRef}
          // style={style}
          {...listeners}
          {...attributes}
          {...rest}
          onClick={handleClick}
          onPointerDown={(e) => {
            e.stopPropagation();
            listeners?.onPointerDown(e);
          }}
          className={cn(
            "group h-fit cursor-grab py-0 transition-all duration-200 active:cursor-grabbing",
            (isDragging || (isGlobalDragging && selected)) && "opacity-50",
            !isMenuOpen && "hover:scale-105 hover:bg-accent/50 hover:shadow-lg",
            selected && "bg-blue-100 ring-2 ring-blue-500 dark:bg-blue-900/30 dark:ring-blue-400",
          )}
        >
          <ContextMenu>
            <ContextMenuTrigger>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="flex min-w-0 flex-1 select-none items-center gap-2">
                    {/* <img src={endpoints.link.favicon(getDomainAndTLD(link.url))} width={16} /> */}
                    <img
                      alt=""
                      // TODO: use staticFile function
                      src={`${env.VITE_SERVER_URL}/api/link/${getDomainAndTLD(link.url)}/favicon`}
                      width={16}
                    />

                    <span className="line-clamp-1 truncate text-muted-foreground text-sm">
                      {link.title || link.url}
                    </span>
                  </div>

                  <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-6 w-6 p-0 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100",
                          isMenuOpen && "opacity-100",
                        )}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setDialogType("rename")}>
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDialogType("move")}>
                        Move to Folder
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDialogType("delete")}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <LinkRenameDialog
                    link={link}
                    open={dialogType === "rename"}
                    onClose={onDialogClose}
                  />
                  <LinkMoveDialog
                    link={link}
                    open={dialogType === "move"}
                    onClose={onDialogClose}
                  />
                  <LinkDeleteDialog
                    link={link}
                    open={dialogType === "delete"}
                    onClose={onDialogClose}
                  />
                </div>
              </CardContent>
            </ContextMenuTrigger>
            <ContextMenuContent className="data-[state=closed]:animate-none!">
              <ContextMenuItem onClick={() => setDialogType("rename")}>Rename</ContextMenuItem>
              <ContextMenuItem onClick={() => setDialogType("move")}>
                Move to Folder
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem className="text-destructive" onClick={() => setDialogType("delete")}>
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit">
        <LinkPreview id={link.id} />
      </HoverCardContent>
    </HoverCard>
  );
}
