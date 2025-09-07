import { useSearch } from "@tanstack/react-router";
import { Link } from "lucide-react";
import { GoTop } from "@/components/go-top";
import { Main, mainCenter } from "@/layouts/containers/main";
import { cn } from "@/lib/utils";
import { LinkBreadcrumb } from "../components/breadcrumb";
import { LinkFilter } from "../components/filter";
import { getFilterType } from "../utils";

export function LinkLayout({ children }: { children: React.ReactNode }) {
  const search = useSearch({ from: "/links/" });
  const type = getFilterType(search);
  const { path } = search;

  return (
    <Main className="flex h-full flex-col">
      {/* Header */}
      <div className={mainCenter}>
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Link className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-3xl">Links</h1>
              <p className="text-muted-foreground">Organize and explore your links</p>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(mainCenter, "sticky top-0 z-10 mb-4 bg-background")}>
        <LinkFilter className="my-6" />
        {type === "tree" && <LinkBreadcrumb folder={path} className="" />}
      </div>

      <GoTop />

      {children}
    </Main>
  );
}
