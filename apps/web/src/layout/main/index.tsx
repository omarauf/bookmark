import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { XBreadcrumb, type XBreadcrumbProps } from "@/components/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ConfigDrawer } from "@/settings";
import { ThemeSwitch } from "@/theme/theme-switch";
import { Search } from "../search/search";
import { ProfileDropdown } from "./profile-dropdown";

type Props = {
  layout?: "auto" | "fixed" | "header-fixed";
  noHeader?: boolean;
  island?: boolean;
  shrink?: boolean;
  children?: React.ReactNode;
  hideSearch?: boolean;
  hideProfile?: boolean;
  hideThemeSwitch?: boolean;
  hideConfigDrawer?: boolean;
  hideSidebarTrigger?: boolean;
  breadcrumbs?: XBreadcrumbProps["breadcrumbs"];
  action?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  icon?: LucideIcon;
};

export function Main({
  layout = "auto",
  noHeader = false,
  island,
  shrink,
  children,
  hideSearch,
  hideProfile,
  hideThemeSwitch,
  hideConfigDrawer,
  hideSidebarTrigger,
  breadcrumbs,
  action,
  headerClassName,
  className,
  icon: Icon,
}: Props) {
  const [offset, setOffset] = useState(0);

  const allRightHidden = hideSearch && hideProfile && hideThemeSwitch && hideConfigDrawer;

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    // Add scroll listener to the body
    document.addEventListener("scroll", onScroll, { passive: true });

    // Clean up the event listener on unmount
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={cn("flex h-full min-h-0 flex-col", island && "gap-1 bg-sidebar")}>
      {/* <div
       className={cn("h-full min-h-0 w-full", island && "gap-1 bg-sidebar")}
       style={{ display: "grid", gridTemplateRows: "auto 1fr" }}
     > */}
      {!noHeader && (
        <header
          className={cn(
            "z-50",
            layout === "header-fixed" && "header-fixed peer/header sticky top-0 w-[inherit]",
            island && "rounded-xl bg-background",
            offset > 10 && layout === "header-fixed" ? "shadow" : "shadow-none",
            headerClassName,
          )}
        >
          <div
            className={cn(
              "relative flex h-full items-center gap-3 p-4 sm:gap-4",
              offset > 10 &&
                layout === "header-fixed" &&
                "after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg",
            )}
          >
            {!hideSidebarTrigger && (
              <>
                <SidebarTrigger variant="outline" className="max-md:scale-125" />
                <Separator orientation="vertical" className="h-6!" />
              </>
            )}
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            <XBreadcrumb breadcrumbs={breadcrumbs} />
            {action}

            {/* <TopNav links={topNav} /> */}
            {!allRightHidden && (
              <div className="ms-auto flex items-center space-x-4">
                {!hideSearch && <Search />}
                {!hideThemeSwitch && <ThemeSwitch />}
                {!hideConfigDrawer && <ConfigDrawer />}
                {!hideProfile && <ProfileDropdown />}
              </div>
            )}
          </div>
        </header>
      )}

      <main
        data-layout={layout}
        // className={cn("px-4", className)}
        className={cn(
          "flex grow flex-col px-4 pb-6",

          // If layout is fixed, make the main container flex and grow
          layout === "fixed" && "flex grow flex-col overflow-hidden pb-0",
          island && "rounded-xl bg-background",

          // If layout is not shrink, set the max-width
          shrink && "@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl",
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}
