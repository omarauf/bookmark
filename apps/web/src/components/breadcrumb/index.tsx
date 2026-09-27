import { Link, type LinkProps } from "@tanstack/react-router";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type XBreadcrumbProps = {
  breadcrumbs: { label: string; value?: LinkProps["to"] }[] | undefined;
  skeletonCount?: number;
};

export function XBreadcrumb({ breadcrumbs, skeletonCount = 0 }: XBreadcrumbProps) {
  const showSkeleton = (breadcrumbs === undefined || breadcrumbs === null) && skeletonCount > 0;
  const hasItems = !!breadcrumbs && breadcrumbs.length > 0;

  return (
    <Breadcrumb>
      <BreadcrumbList className="no-scrollbar flex-nowrap overflow-x-auto overflow-y-hidden whitespace-nowrap">
        {/* Home */}
        <BreadcrumbItem>
          <Item label="Home" value="/" isLast={false} />
        </BreadcrumbItem>

        {/* Separator only if there are items OR skeletons */}
        {(hasItems || showSkeleton) && <BreadcrumbSeparator />}

        {/* Skeleton placeholders */}
        {showSkeleton
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <React.Fragment key={`sk-${index}`}>
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex">
                    <SkeletonCrumb index={index} />
                  </BreadcrumbPage>
                </BreadcrumbItem>

                {index < skeletonCount - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))
          : /* Dynamic breadcrumb items */
            breadcrumbs?.map(({ label, value }, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <Item isLast={index === breadcrumbs.length - 1} label={label} value={value} />
                </BreadcrumbItem>

                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function Item({
  label,
  value,
  isLast,
}: {
  label: string;
  isLast: boolean;
  value?: LinkProps["to"];
}) {
  if (value === undefined || isLast)
    return <BreadcrumbPage className="text-primary">{label}</BreadcrumbPage>;

  return (
    <BreadcrumbLink
      render={
        <Link to={value} className="transition-colors hover:text-foreground">
          {label}
        </Link>
      }
    />
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
