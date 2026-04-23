import { useNavigate, useSearch } from "@tanstack/react-router";
import { LayoutGrid, LayoutList, Search } from "lucide-react";
import { XToggleGroup } from "@/components/inputs/toggle-group";
import { Input } from "@/components/ui/input";
import { Header } from "@/layout/header";

type Props = {
  className?: string;
};

export function Toolbar({ className }: Props) {
  const { view, q } = useSearch({ from: "/_authenticated/links/" });
  const navigate = useNavigate({ from: "/links/" });

  const handleViewChange = (newView: "tree" | "table") => {
    navigate({ search: (s) => ({ ...s, view: newView }) });
  };

  const handleSearchChange = (search: string) => {
    navigate({ search: (s) => ({ ...s, q: search || undefined }) });
  };

  return (
    <Header hideSearch className={className}>
      <div className="relative max-w-sm flex-1">
        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search links..."
          value={q || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="h-9 pl-8"
        />
      </div>

      <XToggleGroup
        value={view}
        options={[
          { value: "tree", icon: LayoutGrid },
          { value: "table", icon: LayoutList },
        ]}
        onChange={(v) => v && handleViewChange(v)}
      />
    </Header>
  );
}
