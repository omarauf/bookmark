import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "@/assets/logo";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "../../components/ui/button";

export function AppTitle() {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="gap-0 py-0 hover:bg-transparent active:bg-transparent"
          render={
            <div>
              <Link
                to="/"
                onClick={() => setOpenMobile(false)}
                className="flex flex-1 items-center gap-3 text-start leading-tight"
              >
                <Logo className="size-6!" />
                <div className="flex flex-1 flex-col text-start font-bold text-lg leading-tight">
                  LinkMind
                </div>
              </Link>
              <ToggleSidebar />
            </div>
          }
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function ToggleSidebar({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("aspect-square size-8 max-md:scale-125", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <X className="md:hidden" />
      <Menu className="max-md:hidden" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
