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
  fixed?: boolean;
  headerFixed?: boolean;
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
  fixed,
  headerFixed,
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
    <>
      <header
        className={cn(
          "z-50",
          headerFixed && "header-fixed peer/header sticky top-0 w-[inherit]",
          offset > 10 && headerFixed ? "shadow" : "shadow-none",
          headerClassName,
        )}
      >
        <div
          className={cn(
            "relative flex h-full items-center gap-3 p-4 sm:gap-4",
            offset > 10 &&
              headerFixed &&
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

          {/* <TopNav links={topNav} /> */}
          {!allRightHidden && (
            <div className="ms-auto flex items-center space-x-4">
              {!hideSearch && <Search />}
              {!hideThemeSwitch && <ThemeSwitch />}
              {!hideConfigDrawer && <ConfigDrawer />}
              {!hideProfile && <ProfileDropdown />}
            </div>
          )}

          {action}
        </div>
      </header>

      <main
        data-layout={fixed ? "fixed" : "auto"}
        // className={cn("px-4", className)}
        className={cn(
          "px-4 pb-6",

          // If layout is fixed, make the main container flex and grow
          fixed && "flex grow flex-col overflow-hidden pb-0",

          // If layout is not shrink, set the max-width
          shrink && "@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl",
          className,
        )}
      >
        {children}
      </main>
    </>
  );
}
