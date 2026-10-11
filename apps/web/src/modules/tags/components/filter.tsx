import { useNavigate, useSearch } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { useEffect } from "react";
import { useAppForm } from "@/components/form";
import { cn } from "@/lib/utils";
import { CreateTagDialog } from "../dialogs/create";

type Props = {
  className?: string;
};

export function TagFilter({ className }: Props) {
  const { search } = useSearch({ from: "/_authenticated/tags/" });
  const navigate = useNavigate({ from: "/tags/" });

  const form = useAppForm({
    defaultValues: { search: search ?? "" },
    listeners: {
      onChangeDebounceMs: 500,
      onChange({ formApi }) {
        navigate({ search: { search: formApi.state.values.search || undefined } });
      },
    },
  });

  useEffect(() => form.reset({ search: search ?? "" }), [search, form]);

  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row", className)}>
      <form.AppField name="search">
        {(field) => <field.Input placeholder="Search tags..." icon={SearchIcon} />}
      </form.AppField>

      <CreateTagDialog />
    </div>
  );
}
