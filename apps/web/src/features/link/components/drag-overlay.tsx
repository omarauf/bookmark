import { DragOverlay } from "@dnd-kit/core";
import type { Link } from "@workspace/contracts/link";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import { useShallow } from "zustand/react/shallow";
import { env } from "@/config/env";
import { useLinkDragStore } from "../hooks/store";
import { getDomainAndTLD } from "../utils";

const maxVisibleCards = 3; // Maximum number of cards to show in the stack

export function LinkDragOverlay({ links }: { links: Link[] }) {
  const [selectedIds, activeId] = useLinkDragStore(useShallow((s) => [s.selectedIds, s.activeId]));

  const isMultipleSelection = selectedIds.size > 1;

  const activeLink = links.find((link) => link.id === activeId);
  const draggedLinks = links.filter((link) => selectedIds.has(link.id));

  return (
    <DragOverlay>
      {activeId && activeLink ? (
        <div className="relative">
          {isMultipleSelection ? (
            <div>
              {draggedLinks.slice(0, maxVisibleCards).map((link, index) => (
                <LinkCard key={link.id} link={link} index={index} />
              ))}

              {/* Count badge for additional items */}
              {selectedIds.size > maxVisibleCards && (
                <Badge
                  variant="secondary"
                  className="-top-2 -right-2 absolute h-6 w-6 rounded-full p-0 font-bold text-xs"
                  style={{ zIndex: maxVisibleCards + 1 }}
                >
                  +{selectedIds.size - maxVisibleCards}
                </Badge>
              )}

              {/* Total count badge */}
              <Badge
                variant="default"
                className="-top-2 -left-2 absolute h-6 w-6 rounded-full p-0 font-bold text-xs"
                style={{ zIndex: maxVisibleCards + 1 }}
              >
                {selectedIds.size}
              </Badge>
            </div>
          ) : (
            // Show single card for single selection

            <LinkCard link={activeLink} index={0} />
          )}
        </div>
      ) : null}
    </DragOverlay>
  );
}

function LinkCard({ link, index }: { link: Link; index: number }) {
  return (
    <Card
      key={link.id}
      className="w-full cursor-grabbing py-0 opacity-90 shadow-lg transition-all"
      style={
        index > 0
          ? {
              position: "absolute",
              top: 0,
              transformOrigin: "top left",
              zIndex: maxVisibleCards - index,
              transform: `rotate(${(index % maxVisibleCards) * 3}deg)`,
            }
          : {
              position: "relative",
              zIndex: maxVisibleCards,
              transform: `rotate(${0}deg)`,
            }
      }
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <img
            alt="Link favicon"
            src={`${env.VITE_SERVER_URL}/api/link/${getDomainAndTLD(link.url)}/favicon`}
            width={16}
          />
          <span className="line-clamp-1 text-muted-foreground text-sm">
            {link.title || link.url}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
