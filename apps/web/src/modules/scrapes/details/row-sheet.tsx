import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ScrapeRow } from "./parse";

export function ScrapeRowSheet({
  row,
  onClose,
}: {
  row: ScrapeRow | undefined;
  onClose: () => void;
}) {
  const json = useMemo(() => (row ? JSON.stringify(row.value, null, 2) : ""), [row]);

  return (
    <Sheet
      open={row !== undefined}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="w-full! gap-0 sm:max-w-3xl!">
        <SheetHeader className="shrink-0 border-b pr-12">
          <SheetTitle>
            Row {row ? row.index + 1 : ""}
            {row?.externalId ? ` · ${row.externalId}` : ""}
          </SheetTitle>
          <SheetDescription className="break-all font-mono text-xs">{row?.path}</SheetDescription>
        </SheetHeader>
        <ScrollArea
          className="min-h-0 flex-1"
          viewportProps={{ className: "overscroll-contain", "aria-label": "Row JSON content" }}
        >
          <pre className="whitespace-pre-wrap break-all p-4 font-mono text-xs leading-6">
            {json}
          </pre>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
