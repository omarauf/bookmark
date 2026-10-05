import { useNavigate, useSearch } from "@tanstack/react-router";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

  const onClickHandler = (value: string) => {
    navigate({ to: ".", search: { path: value || "/" } });
  };

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="no-scrollbar flex-nowrap overflow-x-auto overflow-y-hidden whitespace-nowrap">
        {/* Home */}
        <BreadcrumbItem>
          <Item onClick={() => onClickHandler("")} label="Bookmarks" isLast={false} />
        </BreadcrumbItem>

        {/* Separator only if there are items OR skeletons */}
        <BreadcrumbSeparator />

        {/* Skeleton placeholders */}
        {breadcrumbs?.map(({ label, value }, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              <Item
                onClick={() => onClickHandler(value)}
                isLast={index === breadcrumbs.length - 1}
                label={label}
              />
            </BreadcrumbItem>

            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function Item({ label, isLast, onClick }: { label: string; isLast: boolean; onClick: () => void }) {
  if (isLast) return <BreadcrumbPage>{label}</BreadcrumbPage>;

  return (
    <BreadcrumbLink
      render={
        <button type="button" onClick={onClick} className="transition-colors hover:text-foreground">
          {label}
        </button>
      }
    ></BreadcrumbLink>
  );
}
