import { cn } from "@/lib/utils";
import { ConfigDrawer } from "@/settings";
import { ThemeSwitch } from "@/theme/theme-switch";
import { Header } from "../header";
import { Search } from "../search/search";
import { ProfileDropdown } from "./profile-dropdown";
import { TopNav } from "./top-nav";

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean;
  fluid?: boolean;
  ref?: React.Ref<HTMLElement>;
  contentClassName?: string;
};

const topNav = [
  {
    title: "Overview",
    href: "dashboard/overview",
    isActive: true,
    disabled: false,
  },
  {
    title: "Customers",
    href: "dashboard/customers",
    isActive: false,
    disabled: true,
  },
  {
    title: "Products",
    href: "dashboard/products",
    isActive: false,
    disabled: true,
  },
  {
    title: "Settings",
    href: "dashboard/settings",
    isActive: false,
    disabled: true,
  },
];

export function Main({ className, fixed, fluid, children, contentClassName, ...props }: MainProps) {
  return (
    <main
      data-layout={fixed ? "fixed" : "auto"}
      className={cn(
        // If layout is fixed, make the main container flex and grow
        fixed && "flex grow flex-col overflow-hidden",
        className,
      )}
      {...props}
    >
      <Header>
        <TopNav links={topNav} />
        <div className="ms-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <div
        className={cn(
          "px-4 py-6",

          // If layout is not fluid, set the max-width
          !fluid && "@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl",

          contentClassName,
        )}
      >
        {children}
      </div>
    </main>
  );
}
