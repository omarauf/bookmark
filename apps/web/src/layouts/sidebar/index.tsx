import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { sidebarData } from "@/data/sidebar-data";
import { cn } from "@/lib/utils";
import { ThemeSwitch } from "@/theme";
import { ProfileDropdown } from "../components/profile-dropdown";
import { NavGroup } from "./nav-group";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <div
          style={{
            width: state === "expanded" ? 40 : 32,
            height: state === "expanded" ? 40 : 32,
            fontSize: state === "expanded" ? 16 : 12,
            background: "#eee",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#888", fontWeight: "bold" }}>Logo</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((item) => (
          <NavGroup key={item.title} {...item} />
        ))}
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter
        className={cn(
          "flex w-full items-center",
          state === "expanded" ? "flex-row justify-between" : "flex-col-reverse",
        )}
      >
        <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
        <ThemeSwitch />
        <ProfileDropdown />
      </SidebarFooter>
    </Sidebar>
  );
}
