import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { DatePicker } from "@/components/form/date-picker";
import { DebounceInput } from "@/components/form/denounced-input";
import { XMultiSelect } from "@/components/form/multi-select";
import { XToggleGroup } from "@/components/form/toggle-group";
import { Button } from "@/components/ui/button";
import { orpc } from "@/integrations/orpc";
import { cn } from "@/lib/utils";

export function Filter({ className }: { className?: string }) {
  const collectionsQuery = useQuery(orpc.collection.list.queryOptions({ input: {} }));
  const tagsQuery = useQuery(orpc.tag.list.queryOptions({ input: {} }));

  const search = useSearch({ from: "/_authenticated/tiktok/" });
  const navigate = useNavigate({ from: "/tiktok/" });

  const setFilter = useCallback(
    (newFilter: any) => navigate({ search: { ...search, ...newFilter } }),
    [search, navigate],
  );
  const clearFilter = useCallback(() => navigate({ search: {} }), [navigate]);

  const isClearable = Object.values(search).some(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== "" &&
      (!Array.isArray(value) || value.length > 0),
  );

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "flex w-full gap-4 transition-all duration-200",
        isScrolled ? "py-3" : "py-6",
        className,
      )}
    >
      <XMultiSelect
        value={search.collections || []}
        onChange={(v) => setFilter({ collections: v })}
        placeholder="Select a Collections"
        options={collectionsQuery.data?.map((t) => ({ label: t.name, value: t.id })) || []}
        className="w-50"
      />

      <XMultiSelect
        value={search.tags || []}
        onChange={(v) => setFilter({ tags: v })}
        placeholder="Select a Tags"
        options={tagsQuery.data?.map((t) => ({ label: t.name, value: t.id })) || []}
        className="w-50"
      />

      <DebounceInput
        placeholder="username..."
        className="w-50"
        value={search.username || ""}
        onChange={(v) => setFilter({ username: v })}
      />

      <DatePicker
        label="From"
        date={search.minDate}
        setDate={(date) => setFilter({ minDate: date })}
      />

      <DatePicker
        label="To"
        date={search.maxDate}
        setDate={(date) => setFilter({ maxDate: date })}
      />

      <XToggleGroup
        value={search.sortOrder || "desc"}
        onChange={(v) => setFilter({ sortOrder: v })}
        options={[
          { value: "asc", label: "", icon: "lucide:sort-asc" },
          { value: "desc", label: "", icon: "lucide:sort-desc" },
        ]}
      />

      {/* <XCheckboxGroup
        value={search.types}
        direction="row"
        onChange={(types) => setUser({ ...user, types })}
        options={[
          { value: "creator", label: "Creator" },
          { value: "tagged", label: "Tagged" },
        ]}
      /> */}

      <div className="grow" />

      <Button
        variant="outline"
        disabled={!isScrolled}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Go to Top
      </Button>

      <Button disabled={!isClearable} onClick={clearFilter}>
        Clear
      </Button>
    </div>
  );
}
