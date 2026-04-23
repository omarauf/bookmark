import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ConfigDrawer } from "@/settings";
import { ThemeSwitch } from "@/theme/theme-switch";
import { ProfileDropdown } from "../main/profile-dropdown";
import { Search } from "../search/search";

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
  children?: React.ReactNode;
  hideSearch?: boolean;
  hideProfile?: boolean;
  hideThemeSwitch?: boolean;
  hideConfigDrawer?: boolean;
  hideSidebarTrigger?: boolean;
  // contentClassName?: string;
};

export function Header({
  className,
  fixed,
  children,
  hideSearch,
  hideProfile,
  hideThemeSwitch,
  hideConfigDrawer,
  hideSidebarTrigger,
  // contentClassName,
  ...props
}: HeaderProps) {
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
    <header
      className={cn(
        "z-50 px-4 py-4",
        fixed && "header-fixed peer/header sticky top-0 w-[inherit]",
        offset > 10 && fixed ? "shadow" : "shadow-none",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "relative flex h-full items-center gap-3 sm:gap-4",
          offset > 10 &&
            fixed &&
            "after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg",
        )}
      >
        {!hideSidebarTrigger && (
          <>
            <SidebarTrigger variant="outline" className="max-md:scale-125" />
            <Separator orientation="vertical" className="h-6" />
          </>
        )}

        {/* <div className={cn("flex grow gap-2", contentClassName)}>{children}</div> */}
        {children}

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
  );
}

// const topNav = [
//   {
//     title: "Overview",
//     href: "dashboard/overview",
//     isActive: true,
//     disabled: false,
//   },
//   {
//     title: "Customers",
//     href: "dashboard/customers",
//     isActive: false,
//     disabled: true,
//   },
//   {
//     title: "Products",
//     href: "dashboard/products",
//     isActive: false,
//     disabled: true,
//   },
//   {
//     title: "Settings",
//     href: "dashboard/settings",
//     isActive: false,
//     disabled: true,
//   },
// ];
