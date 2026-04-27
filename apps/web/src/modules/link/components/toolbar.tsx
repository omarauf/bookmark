import { useNavigate, useSearch } from "@tanstack/react-router";
import { LayoutGrid, LayoutList, Search, X } from "lucide-react";
import { useAppForm } from "@/components/form";
import { XToggleGroup } from "@/components/inputs/toggle-group";
import { Button } from "@/components/ui/button";
import { Header } from "@/layout/header";
import { FetchPreviewsDialog } from "../dialogs/fetch-previews-dialog";
import { RefreshButton } from "./refresh-button";

type Props = {
  className?: string;
};

export function Toolbar({ className }: Props) {
  const { view, q } = useSearch({ from: "/_authenticated/links/" });
  const navigate = useNavigate({ from: "/links/" });

  const form = useAppForm({
    defaultValues: {
      q: q || "",
    },
    listeners: {
      onChange({ formApi }) {
        const { q } = formApi.state.values;
        navigate({ search: (s) => ({ ...s, q }) });
      },
      onChangeDebounceMs: 300,
    },
  });

  const handleViewChange = (newView: "tree" | "table") => {
    navigate({ search: (s) => ({ ...s, view: newView }) });
  };

  return (
    <Header hideSearch className={className}>
      <form.AppField name="q">
        {(field) => (
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <field.Input
              placeholder="Search links..."
              className="h-9 pl-8"
              classNames={{ wrapper: "w-full" }}
            />
          </div>
        )}
      </form.AppField>
      <Button
        variant="outline"
        size="icon"
        disabled={!q}
        onClick={() => form.setFieldValue("q", "")}
      >
        <X className="cursor-pointer" onClick={() => form.setFieldValue("q", "")} />
      </Button>

      <XToggleGroup
        value={view}
        options={[
          { value: "tree", icon: LayoutGrid },
          { value: "table", icon: LayoutList },
        ]}
        onChange={(v) => v && handleViewChange(v)}
      />

      <RefreshButton />

      <FetchPreviewsDialog />
    </Header>
  );
}
