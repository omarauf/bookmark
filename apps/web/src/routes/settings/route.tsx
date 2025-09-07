import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { buttonVariants } from "@workspace/ui/components/button";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import { useState } from "react";
import { Iconify } from "@/components/iconify";
import { Main } from "@/layouts/containers/main";
import { cn } from "@/lib/utils";

const sidebarNavItems = [
  {
    title: "Appearance",
    // icon: <IconPalette size={18} />,
    icon: "",
    href: "/settings/appearance",
  },
  {
    title: "Instagram",
    // icon: <IconTool size={18} />,
    icon: "",
    href: "/settings/instagram",
  },
  {
    title: "Links",
    // icon: <IconTool size={18} />,
    icon: "",
    href: "/settings/links",
  },
];

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const { pathname } = useLocation();
  const navigate = Route.useNavigate();
  const [val, setVal] = useState(pathname ?? "/settings");

  const handleSelect = (e: string) => {
    setVal(e);
    navigate({ to: e });
  };

  return (
    <Main fixed>
      <div className="space-y-0.5">
        <h1 className="font-bold text-2xl tracking-tight md:text-3xl">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="top-0 lg:sticky lg:w-1/5">
          <div className="p-1 md:hidden">
            <Select value={val} onValueChange={handleSelect}>
              <SelectTrigger className="h-12 sm:w-48">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {sidebarNavItems.map((item) => (
                  <SelectItem key={item.href} value={item.href}>
                    <div className="flex gap-x-4 px-2 py-1">
                      {item.icon && <Iconify icon={item.icon} />}
                      <span className="text-md">{item.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea
            type="always"
            className="hidden w-full min-w-40 bg-background px-1 py-2 md:block"
          >
            <nav className="flex space-x-2 py-1 lg:flex-col lg:space-x-0 lg:space-y-1">
              {sidebarNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    pathname === item.href
                      ? "bg-muted hover:bg-muted"
                      : "hover:bg-transparent hover:underline",
                    "justify-start",
                  )}
                >
                  {item.icon && <Iconify icon={item.icon} />}
                  {item.title}
                </Link>
              ))}
            </nav>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </aside>
        <div className="flex w-full overflow-y-hidden p-1">
          <Outlet />
        </div>
      </div>
    </Main>
  );
}
