import { useNavigate, useSearch } from "@tanstack/react-router";
import { XBreadcrumb } from "@/components/breadcrumb";

type Props = {
  className?: string;
};

export function LinkBreadcrumb({ className }: Props) {
  const path = useSearch({ from: "/_authenticated/links/", select: (s) => s.path });
  const navigate = useNavigate();

  const segments = (path || "").split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const value = segments.slice(0, index + 1).join("/");
    return { label: segment, value };
  });

  return (
    <XBreadcrumb
      className={className}
      breadcrumbs={breadcrumbs}
      homeLabel="Bookmarks"
      onClick={(value) => navigate({ to: ".", search: { path: value || "/" } })}
    />
  );
}
