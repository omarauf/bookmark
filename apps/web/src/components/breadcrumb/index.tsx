import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Props = {
  breadcrumbs: { label: string; value?: string }[] | undefined;
  onClick?: (value: string, index: number) => void;
  homeLabel?: string;
  skeletonCount?: number;
};

export function XBreadcrumb({ breadcrumbs, onClick, homeLabel, skeletonCount = 0 }: Props) {
  const isOnClickable = onClick !== undefined;

  const showSkeleton = (breadcrumbs === undefined || breadcrumbs === null) && skeletonCount > 0;
  const hasItems = !!breadcrumbs && breadcrumbs.length > 0;

  return (
    <Breadcrumb>
      <BreadcrumbList className="no-scrollbar flex-nowrap overflow-x-auto overflow-y-hidden whitespace-nowrap">
        {/* Home */}
        <BreadcrumbItem>
          <Item
            onClick={isOnClickable ? () => onClick("", 0) : undefined}
            label={homeLabel || "Home"}
            isLast={false}
          />
        </BreadcrumbItem>

        {/* Separator only if there are items OR skeletons */}
        {(hasItems || showSkeleton) && <BreadcrumbSeparator className="rtl:rotate-180" />}

        {/* Skeleton placeholders */}
        {showSkeleton
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <React.Fragment key={`sk-${index}`}>
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex">
                    <SkeletonCrumb index={index} />
                  </BreadcrumbPage>
                </BreadcrumbItem>

                {index < skeletonCount - 1 && <BreadcrumbSeparator className="rtl:rotate-180" />}
              </React.Fragment>
            ))
          : /* Dynamic breadcrumb items */
            breadcrumbs?.map(({ label, value }, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <Item
                    onClick={isOnClickable && value ? () => onClick(value, index + 1) : undefined}
                    isLast={index === breadcrumbs.length - 1}
                    label={label}
                  />
                </BreadcrumbItem>

                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="rtl:rotate-180" />
                )}
              </React.Fragment>
            ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function Item({
  label,
  isLast,
  onClick,
}: {
  label: string;
  isLast: boolean;
  onClick?: () => void;
}) {
  if (onClick === undefined || isLast) return <BreadcrumbPage>{label}</BreadcrumbPage>;

  return (
    <BreadcrumbLink asChild>
      <button type="button" onClick={onClick} className="transition-colors hover:text-foreground">
        {label}
      </button>
    </BreadcrumbLink>
  );
}

function SkeletonCrumb({ index }: { index: number }) {
  // stagger animation a bit so it feels nicer
  const delay = `${index * 120}ms`;

  return (
    <span aria-hidden="true" className="inline-flex items-center" style={{ animationDelay: delay }}>
      <span className="h-4 w-16 animate-pulse rounded-md bg-gray-200" />
    </span>
  );
}
