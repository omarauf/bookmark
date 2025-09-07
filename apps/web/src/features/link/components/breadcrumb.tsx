import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Fragment } from "react";
import { useClickPath } from "../hooks/use-click-path";
import { breadcrumbify } from "../utils";

export function LinkBreadcrumb({ folder, className }: { folder: string; className?: string }) {
  const { handlePathClick } = useClickPath();

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="cursor-pointer" onClick={() => handlePathClick()}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {breadcrumbify(folder).map((f) => (
          <Fragment key={f.path}>
            <BreadcrumbItem>
              <BreadcrumbLink className="cursor-pointer" onClick={() => handlePathClick(f.path)}>
                {f.label}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="last-of-type:hidden" />
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
