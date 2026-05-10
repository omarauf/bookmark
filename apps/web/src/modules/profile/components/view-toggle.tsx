import { useNavigate, useSearch } from "@tanstack/react-router";
import { LayoutGrid, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProfileViewToggle() {
  const search = useSearch({ from: "/_authenticated/profiles/" });
  const navigate = useNavigate();
  const view = search.view ?? "card";

  const setView = (v: "card" | "table") => {
    navigate({ to: ".", search: (prev) => ({ ...prev, view: v }) });
  };

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      <Button
        variant={view === "card" ? "secondary" : "ghost"}
        size="icon"
        className={cn("h-7 w-7", view === "card" && "bg-background shadow-sm")}
        onClick={() => setView("card")}
        aria-label="Card view"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "table" ? "secondary" : "ghost"}
        size="icon"
        className={cn("h-7 w-7", view === "table" && "bg-background shadow-sm")}
        onClick={() => setView("table")}
        aria-label="Table view"
      >
        <Table2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
