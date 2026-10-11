import { useNavigate, useSearch } from "@tanstack/react-router";
import { ProfileSchemas } from "@workspace/contracts/views/profile";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { containsData } from "@/utils/object";
import { ProfileViewToggle } from "./view-toggle";

type Props = {
  className?: string;
};

export function ProfileFilter({ className }: Props) {
  const search = useSearch({ from: "/_authenticated/profiles/" });
  const navigate = useNavigate();

  const filterData = ProfileSchemas.filter.safeParse(search);

  const form = useAppForm({
    defaultValues: search,
    listeners: {
      onChange({ formApi }) {
        const { ...rest } = formApi.state.values;
        navigate({ to: ".", search: (prev) => ({ ...prev, ...rest, page: 1 }) });
      },
      onChangeDebounceMs: 500,
    },
  });

  const clearFilter = () => {
    navigate({ to: ".", search: undefined });
    form.reset(undefined);
  };

  useEffect(() => form.reset(search), [search, form.reset]);

  const hasData = containsData(filterData.data);

  return (
    <div
      className={cn("flex items-center justify-between gap-3 border-b bg-background", className)}
    >
      <form.AppField name="username">
        {(field) => (
          <field.Input
            placeholder="Search username..."
            classNames={{ wrapper: "w-84" }}
            icon={Search}
          />
        )}
      </form.AppField>

      <form.AppField name="platform">
        {(field) => (
          <field.ToggleGroup
            variant="outline"
            options={[
              { label: "Instagram", value: "instagram" },
              { label: "Twitter", value: "twitter" },
              { label: "TikTok", value: "tiktok" },
            ]}
          />
        )}
      </form.AppField>

      <form.AppField name="sortBy">
        {(field) => (
          <field.Select
            placeholder="Sort By"
            classNames={{ wrapper: "w-64" }}
            options={[
              { label: "Added", value: "addedAt" },
              { label: "Username", value: "username" },
              { label: "Posts", value: "postCount" },
              { label: "Tags", value: "tagCount" },
            ]}
          />
        )}
      </form.AppField>

      <form.AppField name="sortOrder">
        {(field) => (
          <field.Tabs
            defaultValue="desc"
            options={[
              { label: "Latest", value: "desc" },
              { label: "Oldest", value: "asc" },
            ]}
          />
        )}
      </form.AppField>

      <div className="grow" />

      <Button
        variant={hasData ? "secondary" : "ghost"}
        size="sm"
        disabled={!hasData}
        onClick={clearFilter}
        className={cn(
          "transition-all",
          hasData ? "text-foreground" : "text-muted-foreground opacity-50",
        )}
      >
        Reset
      </Button>

      <ProfileViewToggle />
    </div>
  );
}
