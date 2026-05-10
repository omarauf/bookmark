import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSettingStore } from "@/settings/hooks/use-store";
import { NavGroup } from "../nav/nav-group";
import { NavUser } from "../nav/nav-user";
// import { AppTitle } from './app-title'
import { sidebarData } from "./sidebar-data";
import { TeamSwitcher } from "./team-switcher";

export function AppSidebar() {
  const collapsible = useSettingStore((state) => state.collapsible);
  const variant = useSettingStore((state) => state.variant);

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <ScrollArea className="h-full min-h-0">
        <SidebarContent>
          {sidebarData.navGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))}
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
